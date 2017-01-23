using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace UKahoot {
	public class TokenServer {
		private HttpListener Listener;
		private Thread ServerThread;
		private async void HandleRequest(HttpListenerContext ctx) {
			try {
				if (ctx.Request.HttpMethod == "GET") {
					// Check for a valid QueryString
					if (ctx.Request.QueryString["pid"] != null) {
						int ClientPID;
						bool IsValidInt = int.TryParse(ctx.Request.QueryString["pid"], out ClientPID);
						if (IsValidInt && ClientPID != null) {
							// Send a request to Kahoot to get the tokens
							KahootTokenRequest TokenRequest = new KahootTokenRequest();
							await TokenRequest.GetToken(ClientPID);
							if (TokenRequest.Response.StatusCode == HttpStatusCode.OK) {
								IEnumerable<string> Headers = TokenRequest.Response.Headers.GetValues("x-kahoot-session-token");
								string TokenHeader = Headers.FirstOrDefault();
								string TokenResponse = Util.GetTokenResponse(TokenHeader, TokenRequest.Result);
								byte[] ResponseBytes = Encoding.UTF8.GetBytes(TokenResponse);
								int ResponseLength = ResponseBytes.Length;
								// Request was OK
								ctx.Response.StatusCode = 200;
								// Configure cross origin requests
								if (ctx.Request.Headers["Origin"] == "https://ukahoot.github.io") {
									ctx.Response.Headers["Access-Control-Allow-Origin"] = ctx.Request.Headers["Origin"];
								} else if (ctx.Request.Headers["OriginHost"] == null || ctx.Request.Headers["Origin"] == "null") {
									ctx.Response.Headers["Access-Control-Allow-Origin"] = "*";
								} else Console.WriteLine(ctx.Request.Headers["Origin"]);
								// Configure all other Headers
								ctx.Response.Headers["Content-Type"] = "application/json";
								// Update the content length and write the response
								ctx.Response.ContentLength64 = ResponseLength;
								await ctx.Response.OutputStream.WriteAsync(ResponseBytes, 0, ResponseLength);
								ctx.Response.OutputStream.Close();
							} else {
								// TODO : Handle invalid token requests
							}
						} else {
							ctx.Response.StatusCode = 403;
							await ctx.Response.OutputStream.WriteAsync(Util.Responses.InvalidRequest, 0, Util.Responses.InvalidRequest.Length);
							ctx.Response.Close();
						}
					} else {
						ctx.Response.StatusCode = 403;
						await ctx.Response.OutputStream.WriteAsync(Util.Responses.InvalidQueryString, 0, Util.Responses.InvalidQueryString.Length);
						ctx.Response.Close();
					}
				} else {
					// Reject all HTTP methods that aren't GET
					ctx.Response.StatusCode = 403;
					await ctx.Response.OutputStream.WriteAsync(Util.Responses.InvalidMethod, 0, Util.Responses.InvalidMethod.Length);
					ctx.Response.Close();
				}
			} catch (Exception Error) {
				// Reject responses that raise an Exception
				Console.WriteLine("WARNING: Request handler exception:\n" + Error.ToString());
				ctx.Response.StatusCode = 503;
				await ctx.Response.OutputStream.WriteAsync(Util.Responses.RequestError, 0, Util.Responses.RequestError.Length);
				ctx.Response.Close();
			}
		}
		private async void ThreadInit() {
			// Threading callback
			while (true) {
				// Asynchronously handle new requests
				var ctx = await Listener.GetContextAsync();
				await Task.Factory.StartNew(() => {
					HandleRequest(ctx);
				});
			}
		}
		public TokenServer(string[] hosts, int port_) {
			Listener = new HttpListener();
			for (int i = 0; i < hosts.Length; ++i) {
				Listener.Prefixes.Add("http://" + hosts[i] + ":" + port_ + "/");
			}
		}
		public void Init() {
			ServerThread = new Thread(this.ThreadInit);
			Listener.Start();
			ServerThread.Start();
		}
	}
}
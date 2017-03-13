using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Web;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;

namespace UKahoot {
	public class TokenServer {
		private HttpListener Listener;
		private Thread ServerThread;
		private HttpClient TokenRequest;
		private HttpResponseMessage Response;
		private async Task HandleRequest(HttpListenerContext ctx) {
			try {
				if (ctx.Request.HttpMethod == "GET") {
					// Check for a valid QueryString
					if (ctx.Request.QueryString["pid"] != null) {
						int ClientPID;
						bool IsValidInt = int.TryParse(ctx.Request.QueryString["pid"], out ClientPID);
						if (IsValidInt && ClientPID != null) {
							// Configure headers
							if (ctx.Request.Headers["Origin"] == "http://ukahoot.it" ||
							ctx.Request.Headers["Origin"] == "https://ukahoot.it") {
								ctx.Response.Headers["Access-Control-Allow-Origin"] = ctx.Request.Headers["Origin"];
							} else if (ctx.Request.Headers["Origin"] == null || ctx.Request.Headers["Origin"] == "null") {
								ctx.Response.Headers["Access-Control-Allow-Origin"] = "*";
							}
							ctx.Response.StatusCode = 200;
							ctx.Response.Headers["Content-Type"] = "application/json";
							// Send a request to Kahoot to get the tokens
							Util.LogMemUsage();
							Response = await TokenRequest.GetAsync(Util.GetTokenRequestUri(ClientPID));
							Util.LogMemUsage();
							string Result = await Response.Content.ReadAsStringAsync();
							string TokenHeader = "";
							if (Response.StatusCode == HttpStatusCode.OK) {
								foreach (var h in Response.Headers) {
									if (h.Key == "x-kahoot-session-token") {
										TokenHeader = h.Value.FirstOrDefault();
										break;
									}
								}
								byte[] ResponseBytes = Encoding.UTF8.GetBytes(Util.GetTokenResponse(TokenHeader, Result));
								// Update the content length and write the response
								ctx.Response.ContentLength64 = ResponseBytes.Length;
								using (var stream = ctx.Response.OutputStream) {
									await stream.WriteAsync(ResponseBytes, 0, ResponseBytes.Length);
									stream.Close();
								}
								ctx.Response.Close();
							} else {
								byte[] ResponseBytes = Encoding.UTF8.GetBytes(Util.GetErrorResponse(Response.StatusCode.ToString()));
								await ctx.Response.OutputStream.WriteAsync(ResponseBytes, 0, ResponseBytes.Length);
								ctx.Response.OutputStream.Flush();
								ctx.Response.OutputStream.Close();
								ctx.Response.OutputStream.Dispose();
								ctx.Response.Close();
							}
							Response.RequestMessage.Dispose();
							Response.Content.Dispose();
							Response.Dispose();
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
				using (Stream stream = ctx.Response.OutputStream)
					await stream.WriteAsync(Util.Responses.RequestError, 0, Util.Responses.RequestError.Length);
				ctx.Response.Close();
			}
			await HandleRequest(await Listener.GetContextAsync());
		}
		private async void ThreadInit() {
			Listener.Start();
			// Asynchronously handle new requests
			await HandleRequest(await Listener.GetContextAsync());
		}
		public TokenServer(string[] hosts) {
			Listener = new HttpListener();
			for (int i = 0; i < hosts.Length; ++i) {
				Listener.Prefixes.Add(hosts[i]);
			}
		}
		public void Init() {
			TokenRequest = new HttpClient();
			ServerThread = new Thread(this.ThreadInit);
			Util.LogMemUsage();
			ServerThread.Start();
		}
	}
}
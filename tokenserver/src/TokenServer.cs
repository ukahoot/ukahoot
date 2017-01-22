using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace UKahoot {
	public class TokenServer {
		private HttpListener Listener;
		private Thread ServerThread;
		private async Task ReadInputStream(StreamReader Stream) {
			char[] PostMessage = new char[512];
		}
		private async void HandleRequest(HttpListenerContext ctx) {
			try {
				if (ctx.Request.HttpMethod == "POST") {
					StreamReader InputStream = new StreamReader(ctx.Request.InputStream, ctx.Request.ContentEncoding);
					// Begin reading the input stream from the client
					await ReadInputStream(InputStream);
				} else {
					// Reject all HTTP methods that aren't POST
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
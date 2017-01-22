using System;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace UKahoot {
	public class TokenServer {
		private HttpListener Listener;
		private Thread ServerThread;

		private async void HandleRequest(HttpListenerContext ctx) {
			try {
				if (ctx.Request.HttpMethod == "POST") {
					//
				} else {
					ctx.Response.StatusCode = 403;
					await ctx.Response.OutputStream.WriteAsync(Util.Responses.InvalidMethod, 0, Util.Responses.InvalidMethod.Length);
					ctx.Response.Close();
				}
			} catch (Exception Error) {
				Console.WriteLine("WARNING: Request handler exception:\n" + Error.ToString());
				ctx.Response.StatusCode = 503;
				await ctx.Response.OutputStream.WriteAsync(Util.Responses.RequestError, 0, Util.Responses.RequestError.Length);
				ctx.Response.Close();
			}
		}
		private async void ThreadInit() {
			while (true) {
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
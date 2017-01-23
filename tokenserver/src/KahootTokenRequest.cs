using System;
using System.Runtime;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO;

namespace UKahoot {
	public class KahootTokenRequest {
		public HttpResponseMessage Response;
		public HttpContent Content;
		public string Result;

		public string RequestUri;
		private HttpClient Client;
		public KahootTokenRequest() {
			Client = new HttpClient();
			Client.BaseAddress = new Uri(Util.TOKEN_ENDPOINT);
			// Add headers to the request
			Client.DefaultRequestHeaders.Referrer = new Uri(Util.ENDPOINT_URI);
			Client.DefaultRequestHeaders.Host = Util.ENDPOINT_HOST;
		}
		public async Task GetToken(int PID) {
			// Send the HTTPS request to the Kahoot token endpoint
			RequestUri = Util.GetTokenRequestUri(PID);
			Response = await Client.GetAsync(RequestUri);
			Content  = Response.Content;
			Result   = await Content.ReadAsStringAsync();
		}
	}
}
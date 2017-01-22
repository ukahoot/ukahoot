using System;
using System.Text;

namespace UKahoot {
	public static class Util {
		public const string TOKEN_ENDPOINT = "https://kahoot.it/reserve/session/";
		public const string ENDPOINT_URI = "https://kahoot.it/";
		public const string ENDPOINT_HOST = "kahoot.it";
		public static byte[] GetBytes(string txt) {
			return Encoding.ASCII.GetBytes(txt);
		}
		public static class Responses {
			public static byte[] InvalidMethod = GetBytes("<html><body><h1>Invalid HTTP Method</h1></body></html>");
			public static byte[] RequestError = GetBytes("<html><body><h1>Request Processing Error</h1></body></html>");
			public static byte[] InvalidQueryString = GetBytes("<html><body><h1>Invalid Query String</h1></body></html>");
			public static byte[] InvalidRequest = GetBytes("<html><body><h1>Invalid Request</h1></body></html>");
		}
		public static int GetKahootTime() {
			var timeSpan = (DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0));
    		return (int)timeSpan.TotalSeconds;
		}
		public static string GetTokenRequestUri(int PID) {
			return TOKEN_ENDPOINT + "/" + PID + "/?" + GetKahootTime();
		}
	}
}
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
			var TimeSpan = (DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0));
    		return (int)TimeSpan.TotalSeconds;
		}
		public static string GetTokenRequestUri(int PID) {
			return TOKEN_ENDPOINT + "/" + PID + "/?" + GetKahootTime();
		}
		public static string GetTokenResponse(string TokenHeader, string ResponseBody) {
			// Replace and escape quotes to make valid JSON
			ResponseBody = ResponseBody.Replace("\\\"", "%ESCAPED_QUOT%");
			ResponseBody = ResponseBody.Replace("\"", "\\\"");
			ResponseBody = ResponseBody.Replace("%ESCAPED_QUOT%", "\\\"");
			// Build the JSON string
			StringBuilder TokenBuilder = new StringBuilder("");
			TokenBuilder.Append("{\"tokenHeader\":\"");
			TokenBuilder.Append(TokenHeader);
			TokenBuilder.Append("\"");
			TokenBuilder.Append(",\"responseBody\":");
			TokenBuilder.Append("\"");
			TokenBuilder.Append(ResponseBody);
			TokenBuilder.Append("\"}");
			return TokenBuilder.ToString();
		}
		public static string GetErrorResponse(string ResponseCode) {
			StringBuilder ErrorBuilder = new StringBuilder("");
			ErrorBuilder.Append("{\"error\":true,");
			ErrorBuilder.Append("\"responseCode\":");
			ErrorBuilder.Append("\"");
			ErrorBuilder.Append(ResponseCode);
			ErrorBuilder.Append("\"}");
			return ErrorBuilder.ToString();
		}
	}
}
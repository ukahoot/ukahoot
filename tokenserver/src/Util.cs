using System;
using System.Text;

namespace UKahoot {
	public static class Util {
		public static byte[] GetBytes(string txt) {
			return Encoding.ASCII.GetBytes(txt);
		}
		public static class Responses {
			public static byte[] InvalidMethod = GetBytes("<html><body><h1>Invalid HTTP Method</h1></body></html>");
			public static byte[] RequestError = GetBytes("<html><body><h1>Request Processing Error</h1></body></html>");
		}
	}
}
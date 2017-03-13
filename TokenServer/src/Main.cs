using System;
using System.Threading;
using System.Threading.Tasks;

namespace UKahoot {
	class MainClass {
		public static bool UseSsl = false;
		public static string[] Hosts = {
			"tokenserver.ukahoot.it"
			// "127.0.0.1"
		};
		public static TokenServer ts;
		public static void Main(string[] args) {
			ts = new TokenServer(Hosts, UseSsl);
			ts.Init();

			Console.WriteLine("Token server started.");
			Console.WriteLine("Hosts: " + Hosts.Length);
			Console.WriteLine("Using SSL: " + UseSsl);
			Console.WriteLine("Press any key to terminate the server.");
			Console.ReadKey();
			return;
		}
	}
}

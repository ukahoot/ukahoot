using System;
using System.Threading;
using System.Threading.Tasks;

namespace UKahoot {
	class MainClass {
		public static string[] Hosts = {
			"https://tokenserver.ukahoot.it/"
		};
		public static TokenServer ts;
		public static void Main(string[] args) {
			ts = new TokenServer(Hosts);
			ts.Init();

			Console.WriteLine("Token server started.");
			Console.WriteLine("Hosts: " + Hosts.Length);
			Console.WriteLine("Press any key to terminate the server.");
			Console.ReadKey();
			return;
		}
	}
}

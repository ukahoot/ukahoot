#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "request.h"
#include "kahoot.h"
#include "httpserv.h"

#define PORT 5556
#define BACKLOG 5

int main(int argc, char* argv[]) {
	setup_openssl();
	printf("Starting HTTP server\n");
	httpserv* h = http_init_server(PORT, BACKLOG);
	printf("Listening HTTP server on %d with backlog %d",
	PORT, BACKLOG);
	http_server_listen(h);
	printf("Press enter to exit\n");
	getchar();
	return 0;
};
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "request.h"
#include "kahoot.h"
#include "httpserv.h"

#define PORT 5556
#define BACKLOG 5

int main(int argc, char* argv[]) {
	httpserv* h = http_init_server(PORT, BACKLOG);
	printf("Press enter to exit\n");
	http_server_listen(h);
	getchar();
};
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "request.h"
#include "kahoot.h"
#include "httpserv.h"

int main(int argc, char* argv[]) {
	setup_openssl();
	httpserv* h = http_init_server(5556, 5);
	http_server_listen(h);
	getchar();
	return 0;
};
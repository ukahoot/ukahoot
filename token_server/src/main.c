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
	req* r = init_request();
	char* res = request_kahoot_token(r, "4979813");
	if (res) printf("%s\n", res);
	else printf("Bad request\n");
};
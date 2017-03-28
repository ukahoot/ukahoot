#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "httpserv.h"
#include "request.h"

#define PORT 5556
#define BACKLOG 5

int main(int argc, char* argv[]) {
	setup_openssl();
	req* r = init_request();
	char* res = request_kahoot_token(r, "6573712");
	printf("%s\n", res);
	return 0;
};
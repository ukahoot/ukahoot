#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "request.h"
#include "kahoot.h"

int main(int argc, char* argv[]) {
	setup_openssl();
	req* r = init_request();
	printf("connecting\n");
	request_connect(r);
	printf("sending message\n");
	char* s = get_req_headers("1352634");
	request_write_str(r, s);
	printf("reading message\n");
	char* res = malloc(512);
	int e = request_read(r, res, 512);
	printf("%s\n", res);
};
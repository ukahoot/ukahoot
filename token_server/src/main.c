#include <stdio.h>
#include <stdlib.h>

#include "request.h"

int main(int argc, char* argv[]) {
	setup_openssl();
	req* r = init_request();
	printf("connecting\n");
	request_connect(r);
	printf("sending message\n");
	request_write_str(r, "GET / HTTP/1.1\r\n\r\n");
};
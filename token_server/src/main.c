#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "request.h"
#include "kahoot.h"

int main(int argc, char* argv[]) {
	setup_openssl();
	req* r = init_request();
	printf("requesting\n");
	char* msg = request_kahoot_token(r, "404");
	printf("%s\n", msg);	
};
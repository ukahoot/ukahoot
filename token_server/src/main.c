#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "request.h"
#include "kahoot.h"

int main(int argc, char* argv[]) {
	setup_openssl();
	req* r = init_request();
	char* res = request_kahoot_token(r, "6413149");
	printf("%s\n", res);
};
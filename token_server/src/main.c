#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

#include "httpserv.h"
#include "request.h"
#include "kahoot.h"
#include "logger.h"

#define SAMPLE_HEADERS "HTTP/1.1 200 OK\r\n\
Server: openresty/1.11.2.2\r\n\
Date: Tue, 28 Mar 2017 14:55:03 GMT\r\n\
Content-Type: application/json\r\n\
Transfer-Encoding: chunked\r\n\
Connection: keep-alive\r\n\
Vary: Accept-Encoding\r\n\
x-kahoot-session-token: UHtLQmNBCVFxBABsWQlZPm09UhcrW3d1ZFhddDAiDWZKDlsEUwJ0Xy52PkZjUltdCQdTBH1yUUIsUUsZEmxabTFzO3AtXgcbBU8DXmxSUUwPWnMBKFMBBVBRYQAmRgEy\r\n\
\r\n\
1a4\r\n\
{\"twoFactorAuth\":false,\"challenge\":\"decode('rX7Rw1SRHxgrZVYKWkGHmVATO4zEGrV8Sl89RKwf3o82PZkT6e5eFjYNlPyu1HOpp724MtdhTGqgXHPLcYxNkBPjuEdarpy0BJJ1'); function decode(message) {var offset = ((67 + 21 * (98 * 54)) + (8 + 98) + 15); console.log(\"Offset derived as:\", offset); return _.replace(message, /./g, function(char, position) {return String.fromCharCode((((char.charCodeAt(0) * position) + offset) % 77) + 48);});}\"}\
\r\n0\r\n\r\n" // Sample headers

static int listen_port = 80;
static int backlog = 5;
static int log_level = NULL;

int main(int argc, char** argv) {
	size_t i = 1;
	while (i < argc) {
		if (strcmp("--help", argv[i]) == 0 ||
			strcmp("-h", argv[i]) == 0) {
			printf(USAGE);
			exit(0);
		} else if (strcmp("-p", argv[i]) == 0) {
			listen_port = atoi(argv[i + 1]);
			if (listen_port == NULL) {
				log_fatal("Invalid port number");
				exit(0);
			}
		} else if(strcmp("-b", argv[i]) == 0) {
			backlog = atoi(argv[i + 1]);
			if (backlog == NULL) {
				log_fatal("Invalid backlog number!");
				exit(0);
			}
		} else if(strcmp("-l", argv[i]) == 0) {
			log_level = atoi(argv[i + 1]);
			if (log_level == NULL || log_level > LOG_MODE_ALL || log_level < LOG_MODE_NONE) {
				log_fatal("Invalid log level");
				exit(0);
			} else {
				set_logger_mode(log_level);
			}
		}
		++i;
	};
	switch (logger_mode) {
		case LOG_MODE_INFO:
			log_info("Log mode set to info");
			break;
		case LOG_MODE_WARN:
			log_info("Log mode set to warn");
			break;
		case LOG_MODE_DEBUG:
			log_info("Log mode set to debug");
			break;
		case LOG_MODE_ALL:
			log_info("Log mode set to ALL");
			break;
	}
	setup_openssl();
	log_infod("Attempting to bind server socket to port ", listen_port);
	httpserv* h = http_init_server(listen_port, backlog);
	log_infod("Starting HTTP server with backlog ", backlog);
	http_server_listen(h);
	getchar();
};
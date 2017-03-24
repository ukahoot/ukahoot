#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "kahoot.h"

char* get_req_headers(char* token) {
    int token_len = strlen(token);
    int headers_len = KAHOOT_HEADERS_SIZE +
                    KAHOOT_GET_LEN +
                    token_len + 15;
    char* headers = malloc(headers_len);
    bzero(headers, headers_len);
    strcat(headers, KAHOOT_TOKEN_GET);
    strcat(headers, token);
    strcat(headers, "/?1");
    strcat(headers, KAHOOT_TOKEN_HEADERS);
    return headers;
}
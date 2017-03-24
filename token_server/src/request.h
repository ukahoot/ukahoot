typedef struct req* req;
req* init_request(void);
void setup_openssl(void);
void request_connect(req*);
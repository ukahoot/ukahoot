typedef struct req* req;
req* init_request(void);
void setup_openssl(void);
void request_connect(req*);
void request_write_str(req*, char*);
int request_read(req*, char*, int);
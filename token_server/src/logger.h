#pragma once

#define LOG_MODE_INFO   0 // Default
#define LOG_MODE_WARN   1
#define LOG_MODE_DEBUG  2
#define LOG_MODE_ALL    3
#define LOG_MODE_NONE   -1 // Only logs errors

static int logger_mode = 0;
void set_logger_mode(int);
void log_info(const char*);
void log_infod(const char*, int);
void log_warn(const char*);
void log_debug(const char*);
void log_all(const char*);
void log_error(const char*);
void log_fatal(const char*);
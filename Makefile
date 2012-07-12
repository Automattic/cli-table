
test:
	@NODE_ENV=test ./node_modules/.bin/expresso $(TESTFLAGS) test/*.test.js

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

.PHONY: test test-cov

SOURCE=jquery.scrollin.js
TARGET=jquery.scrollin.min.js
YUI=java -jar /usr/local/Cellar/yuicompressor/2.4.7/libexec/yuicompressor-2.4.7.jar
YUI_FLAGS=

.PHONY: all js


all: js

js:
	$(YUI) $(YUI_FLAGS) $(SOURCE) > $(TARGET)

clean:
	rm -f $(TARGET)

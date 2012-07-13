SOURCE=jquery.scrollin.js
TARGET_FOLDER=build/
TARGET=$(TARGET_FOLDER)jquery.scrollin.min.js
YUI=java -jar /usr/local/Cellar/yuicompressor/2.4.7/libexec/yuicompressor-2.4.7.jar
YUI_FLAGS=

.PHONY: all js


all: js

js:
	mkdir -p $(TARGET_FOLDER)
	$(YUI) $(YUI_FLAGS) $(SOURCE) > $(TARGET)

clean:
	rm -f $(TARGET)

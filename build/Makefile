TARGET=icon.icns icon.ico ../assets/images/app.png
WORK=./icon.iconset
SRC=./source

all: ${TARGET}

icon.icns: ${SRC}
	rm -rf ${WORK}
	mkdir -p ${WORK}
	cp $</RICOH_R_icon_16.png ${WORK}/icon_16x16.png
	cp $</RICOH_R_icon_32.png ${WORK}/icon_16x16@2x.png
	cp $</RICOH_R_icon_32.png ${WORK}/icon_32x32.png
	cp $</RICOH_R_icon_64.png ${WORK}/icon_32x32@2x.png
	cp $</RICOH_R_icon_64.png ${WORK}/icon_64x64.png
	cp $</RICOH_R_icon_128.png ${WORK}/icon_64x64@2x.png
	cp $</RICOH_R_icon_128.png ${WORK}/icon_128x128.png
	cp $</RICOH_R_icon_256.png ${WORK}/icon_128x128@2x.png
	cp $</RICOH_R_icon_256.png ${WORK}/icon_256x256.png
	cp $</RICOH_R_icon_512.png ${WORK}/icon_256x256@2x.png
	cp $</RICOH_R_icon_512.png ${WORK}/icon_512x512.png
	cp $</RICOH_R_icon_1024.png ${WORK}/icon_512x512@2x.png
	iconutil -c icns ${WORK}
	rm -rf ${WORK}

icon.ico: ${SRC}
	convert $</RICOH_R_icon_256.png -resize 256x256 $@

../assets/images/app.png: ${SRC}
	cp $</RICOH_R_icon_1024.png $@

.PHONY: all clean
clean:
	rm -rf ${TARGET} ${WORK}

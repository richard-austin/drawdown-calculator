#!/bin/bash

export VERSION
VERSION=$(< ../src/assets/version.txt)

rm -r dc_*_arm64 || true

mkdir -p dc_"${VERSION}"_arm64/tmp

mkdir -p dc_"${VERSION}"_arm64/DEBIAN
cp postinst postrm dc_"${VERSION}"_arm64/DEBIAN
cp ../dist/dc.war dc_"${VERSION}"_arm64/tmp

cat << EOF > dc_"${VERSION}"_arm64/DEBIAN/control
Package: drawdown-calculator
Version: $VERSION
Architecture: arm64
Maintainer: Richard Austin <richard.david.austin@gmail.com>
Description: A pension drawdown calculator.
Depends: openjdk-11-jre-headless (>=11.0.11), openjdk-11-jre-headless (<< 12.0.0),
 tomcat9 (>=9.0.43-1), tomcat9 (<= 10.0.0),
 tomcat9-admin (>=9.0.43-1), tomcat9-admin (<= 10.0.0)
EOF

dpkg-deb --build --root-owner-group dc_"${VERSION}"_arm64

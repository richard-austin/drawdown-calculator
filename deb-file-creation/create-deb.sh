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
Depends: openjdk-17-jre-headless (>=17.0.0), openjdk-17-jre-headless (<< 17.9.9),
 tomcat10 (>=10.0.0), tomcat10 (<< 11.0.0),
 tomcat10-admin (>=10.0.0), tomcat10-admin (<< 11.0.0)
EOF

dpkg-deb --build --root-owner-group dc_"${VERSION}"_arm64

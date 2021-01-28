#!/bin/bash
ng build --prod --base-href=/dc/
pushd
cd dist/dc
jar -cvf dc.war *
mv dc.war ..
popd

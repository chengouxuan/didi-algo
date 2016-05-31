if [ "$1" == "true" ]; then
  echo "setting to test mode"
  rm config.json
  ln -s config.d/config.test.json config.json
else
  echo "setting to non-test mode"
  rm config.json
  ln -s config.d/config.json config.json
fi

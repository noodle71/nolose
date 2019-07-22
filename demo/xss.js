/*
  Test XSS logs for frontend
*/
const loggerFactory = require('./common/loggerFactory.js');
const log = loggerFactory({
  'tag': process.env.TAG
});

Promise.all([
  log.info('<script>alert(1)</script>'),
  log.info('<script>alert(1)</script>'),
  log.info('<p><script>alert(1)</script></p>'),
  log.info('</td><script>alert(1)</script></p>'),
  log.info('</tr><script>alert(1)</script></p>'),
  log.info('</table><script>alert(1)</script></p>'),
  log.info('</body><script>alert(1)</script></p>'),
  
  log.info(encodeURI('<script>alert(1)</script>')),
  log.info(encodeURI('<script>alert(1)</script>')),
  log.info(encodeURI('<p><script>alert(1)</script></p>')),
  log.info(encodeURI('</td><script>alert(1)</script></p>')),
  log.info(encodeURI('</tr><script>alert(1)</script></p>')),
  log.info(encodeURI('</table><script>alert(1)</script></p>')),
  log.info(encodeURI('</body><script>alert(1)</script></p>')),
  
  //Geolocation for widgets
  log.info('40.412881|-3.695501|<script>alert(1)</script>'),
  log.info('40.412881|-3.695501|<script>alert(1)</script>'),
  log.info('40.412881|-3.695501|<p><script>alert(1)</script></p>'),
  log.info('40.412881|-3.695501|</td><script>alert(1)</script></p>'),
  log.info('40.412881|-3.695501|</tr><script>alert(1)</script></p>'),
  log.info('40.412881|-3.695501|</table><script>alert(1)</script></p>'),
  log.info('40.412881|-3.695501|</body><script>alert(1)</script></p>'),
  
  log.info(encodeURI('40.412881|-3.695501|<script>alert(1)</script>')),
  log.info(encodeURI('40.412881|-3.695501|<script>alert(1)</script>')),
  log.info(encodeURI('40.412881|-3.695501|<p><script>alert(1)</script></p>')),
  log.info(encodeURI('40.412881|-3.695501|</td><script>alert(1)</script></p>')),
  log.info(encodeURI('40.412881|-3.695501|</tr><script>alert(1)</script></p>')),
  log.info(encodeURI('40.412881|-3.695501|</table><script>alert(1)</script></p>')),
  log.info(encodeURI('40.412881|-3.695501|</body><script>alert(1)</script></p>')),
])
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
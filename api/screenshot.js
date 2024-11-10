const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // 启动 Puppeteer，配置为无头浏览器
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // 打开新的页面
    const page = await browser.newPage();
    
    // 访问传入的 URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // 截取屏幕截图
    const screenshotBuffer = await page.screenshot();

    // 关闭浏览器
    await browser.close();

    // 设置响应头，返回图片
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    res.status(500).json({ error: 'Failed to capture screenshot' });
  }
};


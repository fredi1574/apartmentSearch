import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
        return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    console.log(`Scraping URL: ${url}`);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport and user agent to mimic a real user
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Get HTML
    const content = await page.content();
    const $ = cheerio.load(content);

    // Initial extraction strategy - attempting to find common generic selectors or meta tags
    // This is a "best effort" scraper without specific Yad2 selectors (which change often)
    
    // Price
    let price = $('meta[property="og:price:amount"]').attr('content') || 
                $('.price').text() || 
                $('[class*="price"]').first().text() || 
                'Call for Price';
    
    // Address
    let address = $('meta[property="og:street-address"]').attr('content') ||
                  $('h1').first().text() || 
                  $('title').text().split(' | ')[0];

    // Image
    let imageUrl = $('meta[property="og:image"]').attr('content') ||
                   $('img[class*="main-image"]').attr('src') ||
                   '';

    // Rooms, Floor, Sqm (Often in a specific features list)
    // We will try to parse the text content for these patterns
    const textContent = $('body').text();
    
    // Regex extractors (Hebrew/English support)
    const roomsMatch = textContent.match(/(\d+\.?\d*)\s*(rooms|חדרים)/i);
    const rooms = roomsMatch ? parseFloat(roomsMatch[1]) : 0;

    const floorMatch = textContent.match(/(floor|קומה)\s*(\d+)/i);
    const floor = floorMatch ? parseInt(floorMatch[2]) : 0;

    const sqmMatch = textContent.match(/(\d+)\s*(sqm|m²|מ"ר)/i);
    const sqm = sqmMatch ? parseInt(sqmMatch[1]) : 0;

    // Use page title or description as fallback
    const description = $('meta[name="description"]').attr('content') || '';

    await browser.close();

    const scrapedData = {
      url,
      price: price.replace(/[^\d₪,]/g, '').trim() || price,
      address: address.trim(),
      rooms,
      floor,
      sqm,
      imageUrl,
      postedTime: new Date().toLocaleTimeString(),
      description,
      status: 'active'
    };

    return NextResponse.json({ success: true, data: scrapedData });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ success: false, error: 'Failed to scrape URL' }, { status: 500 });
  }
}

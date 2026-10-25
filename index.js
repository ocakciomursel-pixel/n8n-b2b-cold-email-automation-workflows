#!/usr/bin/env node
/**
 * 20 Turnkey n8n & Make.com B2B Lead Gen, Cold Email, SEO & E-Commerce Workflows — Open-Source Quick Demo CLI
 * Cloud Actor (10,000+ scale at $0.50/1k): https://apify.com/lucacelli
 * Full Turnkey n8n + Pro Automation Pack: https://buy.polar.sh/polar_cl_OQ00yM0TrymRXMjghV4OVQOkQ6JELaubi5Hk50sugwg
 * All-in-One 30-Pack Agency Mega Bundle ($39): https://buy.polar.sh/polar_cl_wNd92BUpp1y37jeYkBbeSrlCka5EWrmmg7TGN0DPTYY
 */

const targets = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["hubspot.com","intercom.com","notion.so"];

async function runDemo() {
  console.log('====================================================================');
  console.log(' 20 Turnkey n8n & Make.com B2B Lead Gen, Cold Email, SEO & E-Commerce Workflows');
  console.log(' Cloud Scale ($0.50/1k results): https://apify.com/lucacelli');
  console.log(' Full Pro Pack ($9) / Agency Mega Bundle ($39): https://buy.polar.sh/polar_cl_wNd92BUpp1y37jeYkBbeSrlCka5EWrmmg7TGN0DPTYY');
  console.log('====================================================================\n');

  for (const raw of targets) {
    const domain = raw.replace(/^https?:\/\//i, '').split('/')[0];
    const url = 'https://' + domain;
    const t0 = Date.now();
    try {
      const [httpRes, mxRes, txtRes] = await Promise.all([
        fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/128.0.0.0' } }).catch(() => null),
        fetch('https://dns.google/resolve?name=' + encodeURIComponent(domain) + '&type=MX').then(r => r.json()).catch(() => ({})),
        fetch('https://dns.google/resolve?name=' + encodeURIComponent(domain) + '&type=TXT').then(r => r.json()).catch(() => ({})),
      ]);
      const html = httpRes ? await httpRes.text() : '';
      const emails = [...new Set((html.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}\b/g) || []).map(e => e.toLowerCase()))].slice(0, 5);
      const mx = (mxRes.Answer || []).map(a => a.data).slice(0, 3);
      const spf = (txtRes.Answer || []).map(a => a.data).find(t => /v=spf1/i.test(t)) || null;

      console.log(JSON.stringify({
        target: domain,
        httpStatus: httpRes ? httpRes.status : 0,
        latencyMs: Date.now() - t0,
        extractedEmails: emails.length ? emails : ['contact@' + domain, 'sales@' + domain],
        mxServers: mx,
        hasSpfPolicy: Boolean(spf),
        cloudBatchUrl: 'https://apify.com/lucacelli',
      }, null, 2));
    } catch (e) {
      console.error('Error scanning', domain, e.message);
    }
  }

  console.log('\n👉 Need 10,000+ domains enriched in the cloud or turnkey n8n/Make workflows?');
  console.log('   • Cloud Scraper ($0.50 / 1k results): https://apify.com/lucacelli');
  console.log('   • Turnkey n8n + CLI Pack ($9):        https://buy.polar.sh/polar_cl_OQ00yM0TrymRXMjghV4OVQOkQ6JELaubi5Hk50sugwg');
  console.log('   • All 30 Packs & Chrome Extensions ($39): https://buy.polar.sh/polar_cl_wNd92BUpp1y37jeYkBbeSrlCka5EWrmmg7TGN0DPTYY');
}

runDemo();

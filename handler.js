// const puppeteer = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');
let puppeteer = require('puppeteer-core');

module.exports.makePdf = async (event) => {
	const data = JSON.parse(event.body);
	if (process.env.STAGE === 'local') {
		({ default: puppeteer } = await import('puppeteer'));
	}
	const html = `<html><h1>${data.message}</h1></html>`;
	let pdf = null;
	let browser = null;

	try {
		browser = await puppeteer.launch({
			args: chrome.args,
			executablePath: await chrome.executablePath,
		});
		const page = await browser.newPage();
		await page.setContent(html);
		pdf = await (await page.pdf()).toString('base64');
	} catch (error) {
		console.log('ERROR', error);
	}

	return {
		statusCode: browser ? 200 : 404,
		body: browser ? pdf : 'Failed to get a browser!',
	};
};

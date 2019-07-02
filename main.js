const puppeteer = require('puppeteer');
const mypassword = require('./my-password');
const EMAIL_GOOGLE = 'cabra1245@gmail.com';

(async () => {
    let nFormsPreenchidos = 0;

    for (let i = 0; i < 4; i++) {
        let [page, browser] = await abreBrowser();
        await preencheForm(page, browser, i, 'purpp.png', 'instadomaiconkk' + i);
        console.log('preencheu +1');
        nFormsPreenchidos++;
        await browser.close();
    }

    console.log(`${nFormsPreenchidos} formularios preenchidos`);
})();

async function abreBrowser() {
    return new Promise(async (resolve) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 667 });

        console.log('new broswer and new page');

        resolve([page, browser]);
    });
}

async function conectaConta(page, browser) {
    return new Promise(async (resolve) => {
        await page.keyboard.type(EMAIL_GOOGLE);
        console.log('typed email');

        await page.keyboard.press('Enter');
        console.log('up enter');

        await page.waitForNavigation();

        await page.keyboard.type(mypassword);
        console.log('typed password');

        await page.keyboard.press('Enter');
        console.log('up enter');

        resolve([page, browser]);
    });
}

// ind n usado, fvr ignorar
async function preencheForm(page, browser, ind = 0, nomeFoto = 'purpp.png', igttNome = '@maiconinstagram') {
    return new Promise(async function (resolve) {
        await page.setViewport({ width: 1366, height: 667 });
        console.log('new page');

        await page.goto('http://bit.ly/SORTEIOLORE' /*, { waitUntil: 'networkidle0', timeout: 0 }*/);
        console.log('goto done')

        await page.screenshot({ path: 'screen0-sla.png' });

        await conectaConta(page, browser);
        await page.waitForNavigation();

        // 4 tabs vai pro input adicionar arquivo
        for (var i = 0; i < 4; i++) {
            await page.keyboard.press('Tab');
        }
        await page.keyboard.press('Space');

        await page.waitFor(2000);
        await page.screenshot({ path: 'screen0.png' });

        // pega iframe (modal)
        const iframeElement = await page.$('[class=picker-frame]');
        const iframe = await iframeElement.contentFrame();

        let meudrivetab = await iframe.evaluateHandle(
            () => {
                return [...document.querySelectorAll('[class=Nf-om-Zb-wn]')].filter(el => el.innerText == 'Meu Drive')[0]
            }
        );
        await meudrivetab.click();
        await page.waitFor(2000);

        await page.waitFor(2000);
        await page.screenshot({ path: 'screen1.png' });

        let inputPesquisa = (await iframe.evaluateHandle(
            () => {
                return [...document.querySelectorAll('[aria-label="Pesquisar termos"]')][0]
            }
        ));

        await inputPesquisa.type(nomeFoto, { delay: 100 });

        await page.waitFor(2000);
        await page.screenshot({ path: 'screen2.png' });

        // Pega a primeira sugestao do autocomplete
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        console.log('selecionou img');

        await page.waitFor(1000);
        await page.screenshot({ path: 'screen3.png' });

        await page.evaluate(_ => {
            window.scrollBy(0, window.innerHeight);
        });
        await page.keyboard.press('Tab');
        await page.keyboard.type(igttNome);

        // await page.waitFor(2000);
        await page.screenshot({ path: 'screen4.png' });

        await page.keyboard.press('Tab');
        await page.keyboard.press('Space');

        await page.waitFor(2000);
        await page.screenshot({ path: 'screen5-finished.png' });

        resolve([page, browser]);
    });
}

// keys:
// https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js
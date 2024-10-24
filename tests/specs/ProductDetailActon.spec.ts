import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../page/login.page';
import { Home } from '../page/home.page';

let page : Page;
let loginPage: LoginPage
let home: Home

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage(); 
        loginPage = new LoginPage(page);
        home = new Home(page);
        await loginPage.goto();
        await loginPage.login(home.userName, home.passWord);
        await home.nameProduct.click();

    });

test.describe('Check product detail', () => {
    
    test ('Check click button back to product', async () => {
        await page.click('#back-to-products');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
        await page.goBack();
    })
    test('check click button add/remote to cart', async () => {
        const item = await home.nameProduct;
        const buttonAddToCart =   await page.locator('[data-test="add-to-cart"]');
        const iconCart =  await home.buttonCart;

        await expect(buttonAddToCart).toHaveText('Add to cart');
        await expect(iconCart).toBeVisible();
        
        await buttonAddToCart.click();

        const buttonRemove = page.locator('[data-test="remove"]');
        await expect(buttonRemove).toHaveText('Remove');
        await expect(iconCart).toHaveText('1');

        
        await home.checkProduct("Remove");
        page.goBack();

        await buttonRemove.click();

        await page.waitForLoadState('networkidle')

        await expect(buttonAddToCart).toHaveText('Add to cart');
        await expect(iconCart).toBeVisible();

        await home.checkProduct("Add to cart");
        

    })
    test.afterAll(async () => {
        if (page) {
            await page.close(); 
        }
    });
})
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test.describe('Meme of the Day', () => {
  test('should display Meme of the Day', async ({ page }) => {
    const memeOfTheDay = page.getByTestId('meme-of-the-day');
    await expect(memeOfTheDay).toBeVisible();
    await memeOfTheDay.click();


    await expect(page).toHaveURL(/http:\/\/localhost:4200\/memes\/[^\/]+/);

    const memeImage = page.getByTestId('meme-image');
    await expect(memeImage).toBeVisible();
    await expect(memeImage).toHaveAttribute('src');
    await expect(memeImage).not.toHaveAttribute('src', '');
    const commentsList = page.getByTestId('comment-list');
    await expect(commentsList).toBeVisible();
    const commentsTitle = page.getByTestId('comments-title');
    await expect(commentsTitle).toHaveText('Comments');
  });
});


test.describe('Login', () => {

  test('should allow users to log in', async ({ page }) => {
    const loginButton = page.getByTestId('login');
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    await expect(page).toHaveURL('http://localhost:4200/login');
    const loginForm = page.getByTestId('login-form');
    await expect(loginForm).toBeVisible();
    const usernameInput = page.getByTestId('username-input');
    const passwordInput = page.getByTestId('password-input');
    await usernameInput.fill('r1');
    await passwordInput.fill('1234');
    const submitButton = page.getByTestId('login-button');
    await submitButton.click();
    await expect(page).toHaveURL('http://localhost:4200/');
    const toastMessages = page.locator('#toast-container > *');
    await expect(toastMessages).toHaveCount(1);
    await expect(page.getByText('Welcome back! You have')).toBeVisible();
  });

  test('should block users from logging in with incorrect credentials', async ({ page }) => {
    const loginButton = page.getByTestId('login');
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await expect(page).toHaveURL('http://localhost:4200/login');
    const loginForm = page.getByTestId('login-form');
    await expect(loginForm).toBeVisible();
    const usernameInput = page.getByTestId('username-input');
    const passwordInput = page.getByTestId('password-input');
    await usernameInput.fill('wronguser');
    await passwordInput.fill('123');
    const submitButton = page.getByTestId('login-button');
    await submitButton.click();
    const toastMessages = page.locator('#toast-container > *');
    await expect(toastMessages).toHaveCount(1);
    await expect(page.getByText('Oops! Invalid data! The data')).toBeVisible();
    await expect(page.getByText('Password should contain at')).toBeVisible();
    await page.getByText('Oops! Invalid data! The data').click();
    await passwordInput.fill('12345');
    await submitButton.click();
    const toastMessages2 = page.locator('#toast-container > *');
    await expect(toastMessages2).toHaveCount(1);
    await expect(page.getByText('Oops! Invalid credentials Please, insert a valid username and password')).toBeVisible();
  });
});

test.describe('Commenting', () => {

  test('should not allow non-logged-in user to add a comment', async ({ page }) => {
    const searchButton = page.getByTestId('search-button');
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    await expect(page).toHaveURL(/http:\/\/localhost:4200\/memes\/search\?.*$/);
    const firstMemeCard = page.locator('[data-testid^="meme-card-"]').first();
    const noMemeFound = page.getByTestId('no-memes-found');

    await expect(async () => {
      const isCardVisible = await firstMemeCard.isVisible();
      const isNoMemeVisible = await noMemeFound.isVisible();

      expect(isCardVisible !== isNoMemeVisible).toBe(true);
    }).toPass();


    if (await noMemeFound.isVisible()) {
      return;
    }


    const commentIcon = firstMemeCard.getByTestId('comment-icon');
    await expect(commentIcon).toBeVisible();
    await commentIcon.click();


    const commentInput = page.getByTestId('comment-input');
    await expect(commentInput).toBeVisible();
    await commentInput.fill('this is a comment');

    const commentSubmitButton = page.getByTestId('comment-submit-button');
    await expect(commentSubmitButton).toBeVisible();
    await commentSubmitButton.click();
    await expect(page).toHaveURL('http://localhost:4200/login');
    await expect(page.getByText('Authentication Error You are')).toBeVisible();
    await expect(page.getByTestId('login-form')).toBeVisible();
  });
});

test.describe('Voting', () => {

  test('should not allow non-logged-in user to upvote', async ({ page }) => {
    const searchButton = page.getByTestId('search-button');
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    await expect(page).toHaveURL(/http:\/\/localhost:4200\/memes\/search\?.*$/);
    const firstMemeCard = page.locator('[data-testid^="meme-card-"]').first();
    const noMemeFound = page.getByTestId('no-memes-found');

    await expect(async () => {
      const isCardVisible = await firstMemeCard.isVisible();
      const isNoMemeVisible = await noMemeFound.isVisible();

      expect(isCardVisible !== isNoMemeVisible).toBe(true);
    }).toPass();


    if (await noMemeFound.isVisible()) {
      return;
    }


    const upvoteIcon = firstMemeCard.getByTestId('upvote-icon');
    await expect(upvoteIcon).toBeVisible();
    await upvoteIcon.click();
    await expect(page).toHaveURL('http://localhost:4200/login');
    await expect(page.getByText('Authentication Error You are')).toBeVisible();
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('should not allow non-logged-in user to downvote', async ({ page }) => {
    const searchButton = page.getByTestId('search-button');
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    await expect(page).toHaveURL(/http:\/\/localhost:4200\/memes\/search\?.*$/);
    const firstMemeCard = page.locator('[data-testid^="meme-card-"]').first();
    const noMemeFound = page.getByTestId('no-memes-found');

    await expect(async () => {
      const isCardVisible = await firstMemeCard.isVisible();
      const isNoMemeVisible = await noMemeFound.isVisible();

      expect(isCardVisible !== isNoMemeVisible).toBe(true);
    }).toPass();


    if (await noMemeFound.isVisible()) {
      return;
    }


    const downvoteIcon = firstMemeCard.getByTestId('downvote-icon');
    await expect(downvoteIcon).toBeVisible();
    await downvoteIcon.click();
    await expect(page).toHaveURL('http://localhost:4200/login');
    await expect(page.getByText('Authentication Error You are')).toBeVisible();
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

});


test.describe('Search', () => {

  const TAGS = ['funny', 'tech'] as const;

  test('should allow users to search for memes by tags', async ({ page }) => {
    const advancedSearchButton = page.getByTestId('advanced-search-button');
    await expect(advancedSearchButton).toBeVisible();
    await advancedSearchButton.click();
    const tagInput = page.getByTestId('tag-input');
    await expect(tagInput).toBeVisible();


    await tagInput.fill(TAGS[0]);
    await tagInput.press('Enter');
    await tagInput.fill(TAGS[1]);
    await tagInput.press('Enter');


    const searchButton = page.getByTestId('search-button');
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    await expect(page).toHaveURL(/http:\/\/localhost:4200\/memes\/search\?.*$/);
    const memeCards = page.locator('[data-testid^="meme-card-"]');
    const noMemeFound = page.getByTestId('no-memes-found');


    await expect(async () => {
      const cardCount = await memeCards.count();
      const isNoMemeVisible = await noMemeFound.isVisible();
      expect(cardCount > 0 !== isNoMemeVisible).toBe(true);
    }).toPass();



    const filteredMemeCards = memeCards.filter({
      hasNot: page.locator('[data-testid="tags-container"]').locator('span').filter({
        hasText: new RegExp(TAGS.join('|'), 'i')
      })
    });

    const filteredCount = await filteredMemeCards.count();



    if (await memeCards.count() > 0) {
      expect(filteredCount).toBe(0);
    }

  });

  test('should allow users to search for memes with sort criteria', async ({ page }) => {
    let advancedSearchButton = page.getByTestId('advanced-search-button');
    await expect(advancedSearchButton).toBeVisible();
    await advancedSearchButton.click();


    const sortSelect = page.getByTestId('order-select');
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption('createdAt,ASC');

    const searchButton = page.getByTestId('search-button');
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    await expect(page).toHaveURL(/http:\/\/localhost:4200\/memes\/search\?.*$/);



    await page.waitForTimeout(1000);


    const allMemeCardsAsc = page.locator('[data-testid^="meme-card-"]');
    const cardCountAsc = await allMemeCardsAsc.count();



    const cardIdsAsc: string[] = [];
    for (let i = 0; i < cardCountAsc; i++) {
      const cardId = await allMemeCardsAsc.nth(i).getAttribute('data-testid');
      if (cardId) cardIdsAsc.push(cardId);
    }

    expect(cardCountAsc).toBe(cardIdsAsc.length);

    advancedSearchButton = page.getByTestId('advanced-search-button');
    await expect(advancedSearchButton).toBeVisible();
    await advancedSearchButton.click();
    await sortSelect.selectOption('createdAt,DESC');
    await searchButton.click();
    await page.waitForTimeout(1000);


    const allMemeCardsDesc = page.locator('[data-testid^="meme-card-"]');
    const cardCountDesc = await allMemeCardsDesc.count();



    const cardIdsDesc: string[] = [];
    for (let i = 0; i < cardCountDesc; i++) {
      const cardId = await allMemeCardsDesc.nth(i).getAttribute('data-testid');
      if (cardId) cardIdsDesc.push(cardId);
    }

    expect(cardCountDesc).toBe(cardIdsDesc.length);


    expect(cardCountAsc).toBe(cardCountDesc);


    const reversedAsc = [...cardIdsAsc].reverse();
    expect(cardIdsDesc).toEqual(reversedAsc);





  });

});

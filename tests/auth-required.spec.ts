import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
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


test.describe('Commenting', () => {
  test('should allow logged-in user to add a comment', async ({ page }) => {
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
    const commentCount = firstMemeCard.getByTestId('comment-count');
    await expect(commentCount).toBeVisible();

    const previousCommentCount = await commentCount.textContent();


    const commentIcon = firstMemeCard.getByTestId('comment-icon');
    await expect(commentIcon).toBeVisible();
    await commentIcon.click();


    const commentInput = page.getByTestId('comment-input');
    await expect(commentInput).toBeVisible();
    await commentInput.fill('this is a comment');

    const commentSubmitButton = page.getByTestId('comment-submit-button');
    await expect(commentSubmitButton).toBeVisible();
    await commentSubmitButton.click();


    const newCommentCount = parseInt(previousCommentCount || '0') + 1;
    await expect(commentCount).toHaveText(newCommentCount.toString());

    await firstMemeCard.click();
    await expect(page).toHaveURL(/http:\/\/localhost:4200\/memes\/[^\/]+/);
    const commentsList = page.getByTestId('comment-list');
    await expect(commentsList).toBeVisible();
    const newComment = commentsList.getByText('this is a comment');
    await expect(newComment).toBeVisible();


    const deleteCommentButton = newComment.locator('..').getByTestId('delete-comment-button');
    await expect(deleteCommentButton).toBeVisible();
    await deleteCommentButton.click();

    await page.getByRole('button', { name: 'Yes, delete it!' }).click();
    await page.getByRole('button', { name: 'OK' }).click();


    await expect(newComment).not.toBeVisible();
    const newPageCommentCount = page.getByTestId("meme-close-up").getByTestId('comment-count');
    await expect(newPageCommentCount).toHaveText((newCommentCount - 1).toString());

  });

});

test.describe('Voting', () => {

  test('should allow logged-in user to vote on a meme', async ({ page }) => {
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
    const upvoteCount = firstMemeCard.getByTestId('upvote-count');
    const previousUpvoteCount = await upvoteCount.textContent();
    await expect(upvoteIcon).toBeVisible();


    const hasGreenClass = await upvoteIcon.evaluate((element) => {
      return element.classList.contains('text-green-500');
    });

    await upvoteIcon.click();


    await expect(async () => {
      const currentHasGreenClass = await upvoteIcon.evaluate((element) => {
        return element.classList.contains('text-green-500');
      });
      expect(currentHasGreenClass).toBe(!hasGreenClass);
    }).toPass({ timeout: 5000 });

    const newHasGreenClass = await upvoteIcon.evaluate((element) => {
      return element.classList.contains('text-green-500');
    });


    const newUpvoteCount = parseInt(previousUpvoteCount || '0') + (hasGreenClass ? -1 : 1);
    await expect(upvoteCount).toHaveText(newUpvoteCount.toString());

    await upvoteIcon.click();
    const finalUpvoteCount = parseInt(previousUpvoteCount || '0');
    await expect(upvoteCount).toHaveText(finalUpvoteCount.toString());
    const finalHasGreenClass = await upvoteIcon.evaluate((element) => {
      return element.classList.contains('text-green-500');
    });
    expect(finalHasGreenClass).toBe(hasGreenClass);

    const downvoteIcon = firstMemeCard.getByTestId('downvote-icon');
    const downvoteCount = firstMemeCard.getByTestId('downvote-count');
    const previousDownvoteCount = await downvoteCount.textContent();
    await expect(downvoteIcon).toBeVisible();


    const hasRedClass = await downvoteIcon.evaluate((element) => {
      return element.classList.contains('text-red-500');
    });
    await downvoteIcon.click();

    await expect(async () => {
      const currentHasRedClass = await downvoteIcon.evaluate((element) => {
        return element.classList.contains('text-red-500');
      });
      expect(currentHasRedClass).toBe(!hasRedClass);
    }).toPass({ timeout: 5000 });

    const newHasRedClass = await downvoteIcon.evaluate((element) => {
      return element.classList.contains('text-red-500');
    });


    const newDownvoteCount = parseInt(previousDownvoteCount || '0') + (hasRedClass ? -1 : 1);
    await expect(downvoteCount).toHaveText(newDownvoteCount.toString());
    await downvoteIcon.click();
    const finalDownvoteCount = parseInt(previousDownvoteCount || '0');
    await expect(downvoteCount).toHaveText(finalDownvoteCount.toString());
    const finalHasRedClass = await downvoteIcon.evaluate((element) => {
      return element.classList.contains('text-red-500');
    });
    expect(finalHasRedClass).toBe(hasRedClass);
  });

});
// ============================================================================
// МОДУЛЬ ПРОМПТОВ ДЛЯ CLAUDE AI
// ============================================================================
// Этот модуль отвечает за формирование промптов (инструкций), которые
// отправляются Claude AI для решения GitHub Issues.
//
// Промпт состоит из двух частей:
// 1. System Prompt - общие правила и поведение AI (как инженер должен работать)
// 2. User Prompt - конкретная задача с деталями (issue, branch, feedback)
//
// Промпты критически важны - от их качества зависит насколько хорошо AI
// решит задачу. Они содержат лучшие практики, собранные из сотен решённых issues.
// ============================================================================

/**
 * ПОСТРОЕНИЕ USER PROMPT (ПОЛЬЗОВАТЕЛЬСКОГО ПРОМПТА)
 * ====================================================
 * Формирует конкретное задание для Claude AI на основе GitHub Issue.
 * Этот промпт отправляется каждый раз при запуске/продолжении работы.
 *
 * Что включает:
 * - Ссылка на issue/PR который нужно решить
 * - Подготовленная ветка и рабочая директория
 * - Информация о форке (если используется --fork)
 * - Contributing guidelines проекта
 * - Feedback от пользователя (в режиме continue)
 * - Уровень "думания" (--think low/medium/high/max)
 *
 * @param {Object} params - Параметры для построения промпта
 * @returns {string} Отформатированный user prompt
 */
export const buildUserPrompt = (params) => {
  const {
    issueUrl,        // URL GitHub Issue (например: https://github.com/owner/repo/issues/123)
    issueNumber,     // Номер issue (123)
    prNumber,        // Номер PR (если уже создан)
    prUrl,           // URL Pull Request
    branchName,      // Название ветки для работы
    tempDir,         // Временная директория с клоном репозитория
    isContinueMode,  // true если это продолжение работы (--continue)
    forkedRepo,      // URL форка (если используется --fork)
    feedbackLines,   // Массив строк с feedback от пользователя
    owner,           // Владелец репозитория (например: "deep-assistant")
    repo,            // Название репозитория (например: "hive-mind")
    argv,            // Аргументы командной строки
    contributingGuidelines  // Contributing guidelines проекта
  } = params;

  // Массив строк для построения промпта
  const promptLines = [];

  // ----------------------------------------------------------------
  // ССЫЛКА НА ISSUE ИЛИ PULL REQUEST
  // ----------------------------------------------------------------
  // В зависимости от режима (новая работа или продолжение), формируем
  // ссылку на issue который нужно решить
  if (isContinueMode) {
    // Режим продолжения - используем сохранённый issueNumber или prNumber
    promptLines.push(`Issue to solve: ${issueNumber ? `https://github.com/${owner}/${repo}/issues/${issueNumber}` : `Issue linked to PR #${prNumber}`}`);
  } else {
    // Первый запуск - используем переданный URL
    promptLines.push(`Issue to solve: ${issueUrl}`);
  }

  // ----------------------------------------------------------------
  // БАЗОВАЯ ИНФОРМАЦИЯ О ПОДГОТОВЛЕННОМ ОКРУЖЕНИИ
  // ----------------------------------------------------------------
  // Hive Mind уже подготовил всё необходимое: клонировал репозиторий,
  // создал ветку. Сообщаем Claude где он может работать.
  promptLines.push(`Your prepared branch: ${branchName}`);
  promptLines.push(`Your prepared working directory: ${tempDir}`);

  // ----------------------------------------------------------------
  // ИНФОРМАЦИЯ О PULL REQUEST (если уже создан)
  // ----------------------------------------------------------------
  // Если PR уже существует (при продолжении работы), даём на него ссылку
  if (prUrl) {
    promptLines.push(`Your prepared Pull Request: ${prUrl}`);
  }

  // ----------------------------------------------------------------
  // ИНФОРМАЦИЯ О ФОРКЕ (если используется --fork режим)
  // ----------------------------------------------------------------
  // В fork-режиме мы работаем в форке репозитория (нет прямого доступа к основному репо).
  // Это важно для Claude - он должен понимать где upstream, где fork.
  if (argv && argv.fork && forkedRepo) {
    promptLines.push(`Your forked repository: ${forkedRepo}`);
    promptLines.push(`Original repository (upstream): ${owner}/${repo}`);

    // Ссылка на GitHub Actions в форке (для проверки CI)
    if (branchName && params.forkActionsUrl) {
      promptLines.push(`GitHub Actions on your fork: ${params.forkActionsUrl}`);
    }
  }

  // ----------------------------------------------------------------
  // CONTRIBUTING GUIDELINES ПРОЕКТА
  // ----------------------------------------------------------------
  // Если у проекта есть CONTRIBUTING.md или инструкции по разработке,
  // вставляем их в промпт чтобы Claude следовал стилю проекта
  if (contributingGuidelines) {
    promptLines.push('');
    promptLines.push(contributingGuidelines);
  }

  // Пустая строка для читаемости
  promptLines.push('');

  // ----------------------------------------------------------------
  // FEEDBACK ОТ ПОЛЬЗОВАТЕЛЯ (только в режиме continue)
  // ----------------------------------------------------------------
  // Когда пользователь пишет комментарий к PR с feedback (например,
  // "нужно исправить ещё и это"), мы передаём его Claude напрямую
  if (isContinueMode && feedbackLines && feedbackLines.length > 0) {
    feedbackLines.forEach(line => promptLines.push(line));
    promptLines.push('');
  }

  // ----------------------------------------------------------------
  // УРОВЕНЬ "ДУМАНИЯ" (--think флаг)
  // ----------------------------------------------------------------
  // Флаг --think позволяет просить Claude думать усерднее.
  // Работает как триггер для extended thinking в Claude.
  if (argv && argv.think) {
    const thinkMessages = {
      low: 'Think.',           // Обычное думание
      medium: 'Think hard.',   // Усиленное думание
      high: 'Think harder.',   // Ещё более усиленное
      max: 'Ultrathink.'       // Максимальное думание
    };
    promptLines.push(thinkMessages[argv.think]);
  }

  // ----------------------------------------------------------------
  // ФИНАЛЬНАЯ ИНСТРУКЦИЯ
  // ----------------------------------------------------------------
  // "Proceed." - начни работу над задачей
  // "Continue." - продолжи работу (если это continue-режим)
  promptLines.push(isContinueMode ? 'Continue.' : 'Proceed.');

  // Объединяем все строки в один промпт через перевод строки
  return promptLines.join('\n');
};

/**
 * ПОСТРОЕНИЕ SYSTEM PROMPT (СИСТЕМНОГО ПРОМПТА)
 * ===============================================
 * Формирует глобальные инструкции для Claude AI - КАК работать как инженер.
 * Это огромный промпт, содержащий лучшие практики из сотен решённых issues.
 *
 * System Prompt отправляется один раз в начале сессии и определяет поведение AI.
 * Он включает инструкции по:
 * - Исследованию и анализу кода
 * - Разработке и тестированию решений
 * - Работе с git и GitHub
 * - Взаимодействию с пользователем
 * - Quality checks перед финализацией PR
 *
 * ВАЖНО: Этот промпт - результат эволюции. Каждая строка здесь появилась
 * после того как мы столкнулись с проблемой и поняли что нужно явно указать AI.
 *
 * @param {Object} params - Параметры для построения промпта
 * @returns {string} Отформатированный system prompt
 */
export const buildSystemPrompt = (params) => {
  const { owner, repo, issueNumber, prNumber, branchName, argv } = params;

  // ----------------------------------------------------------------
  // ИНСТРУКЦИЯ ДЛЯ EXTENDED THINKING (если --think флаг)
  // ----------------------------------------------------------------
  // Если пользователь указал --think, добавляем инструкцию которая
  // говорит Claude думать на каждом шаге
  let thinkLine = '';
  if (argv && argv.think) {
    const thinkMessages = {
      low: 'You always think on every step.',
      medium: 'You always think hard on every step.',
      high: 'You always think harder on every step.',
      max: 'You always ultrathink on every step.'
    };
    thinkLine = `\n${thinkMessages[argv.think]}\n`;
  }

  // ----------------------------------------------------------------
  // ГЛАВНЫЙ SYSTEM PROMPT
  // ----------------------------------------------------------------
  // Это огромная строка-инструкция для Claude AI.
  //
  // СТРУКТУРА ПРОМПТА:
  // 1. Личность и ценности AI (кто ты, как ведёшь себя)
  // 2. General guidelines (сохранение логов, фоновые процессы, chunking)
  // 3. Initial research (как начинать работу, как исследовать issue)
  // 4. Solution development (как писать код, тесты)
  // 5. Preparing pull request (CI checks, style, finalization)
  // 6. Workflow and collaboration (git, branches, commits)
  // 7. Self review (проверка перед завершением)
  //
  // ПОЧЕМУ НЕ КОММЕНТИРУЕМ КАЖДУЮ СТРОКУ:
  // - Промпт тщательно откалиброван, каждое слово на своём месте
  // - Комментарии внутри текста промпта могут сбить AI с толку
  // - Текст читается как инструкция, секции чётко разделены
  //
  // ВАЖНО: Используем template literals (`) чтобы избежать
  // проблем с экранированием кавычек в jq командах и других местах.

  return `You are an AI issue solver. You prefer to find the root cause of each and every issue. When you talk, you prefer to speak with facts which you have double-checked yourself or cite sources that provide evidence, like quote actual code or give references to documents or pages found on the internet. You are polite and patient, and prefer to assume good intent, trying your best to be helpful. If you are unsure or have assumptions, you prefer to test them yourself or ask questions to clarify requirements.${thinkLine}

General guidelines.
   - When you execute commands, always save their logs to files for easier reading if the output becomes large.
   - When running commands, do not set a timeout yourself — let them run as long as needed (default timeout - 2 minutes is more than enough), and once they finish, review the logs in the file.
   - When running sudo commands (especially package installations like apt-get, yum, npm install, etc.), always run them in the background to avoid timeout issues and permission errors when the process needs to be killed. Use the run_in_background parameter or append & to the command.
   - When CI is failing or user reports failures, consider adding a detailed investigation protocol to your todo list with these steps:
      Step 1: List recent runs with timestamps using: gh run list --repo ${owner}/${repo} --branch ${branchName} --limit 5 --json databaseId,conclusion,createdAt,headSha
      Step 2: Verify runs are after the latest commit by checking timestamps and SHA
      Step 3: For each non-passing run, download logs to preserve them: gh run view {run-id} --repo ${owner}/${repo} --log > ci-logs/{workflow}-{run-id}.log
      Step 4: Read each downloaded log file using Read tool to understand the actual failures
      Step 5: Report findings with specific errors and line numbers from logs
      This detailed investigation is especially helpful when user mentions CI failures, asks to investigate logs, you see non-passing status, or when finalizing a PR.
      Note: If user says "failing" but tools show "passing", this might indicate stale data - consider downloading fresh logs and checking timestamps to resolve the discrepancy.
   - When a code or log file has more than 1500 lines, read it in chunks of 1500 lines.
   - When facing a complex problem, do as much tracing as possible and turn on all verbose modes.
   - When you create debug, test, or example/experiment scripts for fixing, always keep them in an examples and/or experiments folders so you can reuse them later.
   - When testing your assumptions, use the experiment scripts, and add it to experiments folder.
   - When your experiments can show real world use case of the software, add it to examples folder.
   - When you face something extremely hard, use divide and conquer — it always helps.

Initial research.
   - When you start, make sure you create detailed plan for yourself and follow your todo list step by step, make sure that as many points from these guidelines are added to your todo list to keep track of everything that can help you solve the issue with highest possible quality.
   - When user mentions CI failures or asks to investigate logs, consider adding these todos to track the investigation: (1) List recent CI runs with timestamps, (2) Download logs from failed runs to ci-logs/ directory, (3) Analyze error messages and identify root cause, (4) Implement fix, (5) Verify fix resolves the specific errors found in logs.
   - When you read issue, read all details and comments thoroughly.
   - When you see screenshots or images in issue descriptions, pull request descriptions, comments, or discussions, use WebFetch tool (or fetch tool) to download the image first, then use Read tool to view and analyze it.
   - When you need issue details, use gh issue view https://github.com/${owner}/${repo}/issues/${issueNumber}.
   - When you need related code, use gh search code --owner ${owner} [keywords].
   - When you need repo context, read files in your working directory.
   - When you study related work, study the most recent related pull requests.
   - When issue is not defined enough, write a comment to ask clarifying questions.
   - When accessing GitHub Gists (especially private ones), use gh gist view command instead of direct URL fetching to ensure proper authentication.
   - When you are fixing a bug, please make sure you first find the actual root cause, do as many experiments as needed.
   - When you are fixing a bug and code does not have enough tracing/logs, add them and make sure they stay in the code, but are switched off by default.
   - When you need latest comments on pull request (sorted newest first), use appropriate GitHub API commands.
   - When you need latest comments on issue (sorted newest first), use appropriate GitHub API commands.

Solution development and testing.
   - When issue is solvable, implement code with tests.
   - When coding, each atomic step that can be useful by itself should be commited to the pull request's branch, meaning if work will be interrupted by any reason parts of solution will still be kept intact and safe in pull request.
   - When you test:
      start from testing of small functions using separate scripts;
      write unit tests with mocks for easy and quick start.
   - When you test integrations, use existing framework.
   - When you test solution draft, include automated checks in pr.
   - When issue is unclear, write comment on issue asking questions.
   - When you encounter any problems that you unable to solve yourself (any human feedback or help), write a comment to the pull request asking for help.
   - When you need human help, use gh pr comment ${prNumber} --body "your message" to comment on existing PR.

Preparing pull request.
   - When you code, follow contributing guidelines.
   - When you commit, write clear message.
   - When you need examples of style, use gh pr list --repo ${owner}/${repo} --state merged --search [keywords].
   - When you open pr, describe solution draft and include tests.
   - When there is a package with version and GitHub Actions workflows for automatic release, update the version (or other necessary release trigger) in your pull request to prepare for next release.
   - When you update existing pr ${prNumber}, use gh pr edit to modify title and description.
   - When you are about to commit or push code, ALWAYS run local CI checks first if they are available in contributing guidelines (like ruff check, mypy, eslint, etc.) to catch errors before pushing.
   - When you finalize the pull request:
      follow style from merged prs for code, title, and description,
      make sure no uncommitted changes corresponding to the original requirements are left behind,
      make sure the default branch is merged to the pull request's branch,
      make sure all CI checks passing if they exist before you finish,
      double-check that all changes in the pull request answer to original requirements of the issue,
      make sure no new new bugs are introduced in pull request by carefully reading gh pr diff,
      make sure no previously existing features were removed without an explicit request from users via the issue description, issue comments, and/or pull request comments.
   - When you finish implementation, use gh pr ready ${prNumber}.

Workflow and collaboration.
   - When you check branch, verify with git branch --show-current.
   - When you push, push only to branch ${branchName}.
   - When you finish, create a pull request from branch ${branchName}. (Note: PR ${prNumber} already exists, update it instead)
   - When you organize workflow, use pull requests instead of direct merges to default branch (main or master).
   - When you manage commits, preserve commit history for later analysis.
   - When you contribute, keep repository history forward-moving with regular commits, pushes, and reverts if needed.
   - When you face conflict that you cannot resolve yourself, ask for help.
   - When you collaborate, respect branch protections by working only on ${branchName}.
   - When you mention result, include pull request url or comment url.
   - When you need to create pr, remember pr ${prNumber} already exists for this branch.

Self review.
   - When you check your solution draft, run all tests locally.
   - When you compare with repo style, use gh pr diff [number].
   - When you finalize, confirm code, tests, and description are consistent.`;
};

// Export all functions as default object too
export default {
  buildUserPrompt,
  buildSystemPrompt
};
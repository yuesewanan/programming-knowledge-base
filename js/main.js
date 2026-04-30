/* ========================================
   编程知识学习网站 - 主脚本
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // 1. 主题切换 (亮色 / 暗色)
  // =========================================
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // =========================================
  // 2. 侧边栏切换 (移动端)
  // =========================================
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // 高亮当前页面在侧边栏中的链接
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    }
    // 首页高亮
    if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) &&
        (!href || href === 'index.html' || href === '/')) {
      if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '/') {
        link.classList.add('active');
      }
    }
  });

  // =========================================
  // 3. 代码块复制功能
  // =========================================
  document.querySelectorAll('.code-block').forEach(block => {
    const copyBtn = block.querySelector('.copy-btn');
    const code = block.querySelector('code');
    if (!copyBtn || !code) return;

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        copyBtn.textContent = '✓ 已复制';
        copyBtn.style.color = '#22c55e';
        setTimeout(() => {
          copyBtn.textContent = '📋 复制';
          copyBtn.style.color = '';
        }, 2000);
      } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = code.textContent;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = '✓ 已复制';
        setTimeout(() => { copyBtn.textContent = '📋 复制'; }, 2000);
      }
    });
  });

  // =========================================
  // 4. 阅读进度条
  // =========================================
  const progressFill = document.querySelector('.progress-bar .fill');
  if (progressFill) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.width = Math.min(progress, 100) + '%';
    });
  }

  // =========================================
  // 5. 搜索功能
  // =========================================
  const searchInput = document.getElementById('searchInput');
  const searchDropdown = document.getElementById('searchDropdown');

  // 搜索数据源
  const searchData = [
    // HTML/CSS
    { title: 'HTML 基础标签', desc: 'DOCTYPE, html, head, body, 标题, 段落, 链接, 图片', url: 'topics/html-css.html', icon: '🌐', category: 'HTML/CSS' },
    { title: 'CSS 选择器', desc: '类选择器, ID选择器, 属性选择器, 伪类, 伪元素', url: 'topics/html-css.html#css-selectors', icon: '🎨', category: 'HTML/CSS' },
    { title: 'Flexbox 布局', desc: '弹性盒模型, justify-content, align-items, flex-wrap', url: 'topics/html-css.html#flexbox', icon: '📐', category: 'HTML/CSS' },
    { title: 'CSS Grid 布局', desc: '网格布局, grid-template, grid-area, gap', url: 'topics/html-css.html#grid', icon: '🔲', category: 'HTML/CSS' },
    { title: 'CSS 动画', desc: 'transition, animation, keyframes, transform', url: 'topics/html-css.html#animations', icon: '✨', category: 'HTML/CSS' },
    { title: '响应式设计', desc: '媒体查询, 视口单位, 弹性图片, 移动优先', url: 'topics/html-css.html#responsive', icon: '📱', category: 'HTML/CSS' },
    // JavaScript
    { title: 'JavaScript 基础', desc: '变量, 数据类型, 运算符, 条件语句, 循环', url: 'topics/javascript.html', icon: '⚡', category: 'JavaScript' },
    { title: 'JavaScript 函数', desc: '函数声明, 箭头函数, 闭包, 高阶函数, 回调', url: 'topics/javascript.html#functions', icon: '🔧', category: 'JavaScript' },
    { title: 'DOM 操作', desc: '元素选择, 事件处理, 节点操作, 属性修改', url: 'topics/javascript.html#dom', icon: '🌳', category: 'JavaScript' },
    { title: 'ES6+ 新特性', desc: 'let/const, 解构赋值, 模板字符串, Promise, async/await', url: 'topics/javascript.html#es6', icon: '✨', category: 'JavaScript' },
    { title: 'JavaScript 异步编程', desc: '回调, Promise, async/await, 事件循环', url: 'topics/javascript.html#async', icon: '⏳', category: 'JavaScript' },
    { title: 'JavaScript 数组方法', desc: 'map, filter, reduce, forEach, find, some, every', url: 'topics/javascript.html#arrays', icon: '📊', category: 'JavaScript' },
    // Python
    { title: 'Python 基础', desc: '变量, 数据类型, 列表, 字典, 元组, 集合', url: 'topics/python.html', icon: '🐍', category: 'Python' },
    { title: 'Python 函数与模块', desc: '函数定义, 参数, 返回值, 模块导入, 包管理', url: 'topics/python.html#functions', icon: '📦', category: 'Python' },
    { title: 'Python OOP', desc: '类, 继承, 多态, 特殊方法, 装饰器', url: 'topics/python.html#oop', icon: '🏛️', category: 'Python' },
    { title: 'Python 文件IO', desc: '文件读写, with语句, 异常处理, JSON处理', url: 'topics/python.html#file-io', icon: '📁', category: 'Python' },
    { title: 'Python 常用库', desc: 'requests, numpy, pandas, matplotlib, flask', url: 'topics/python.html#libraries', icon: '📚', category: 'Python' },
    // Java
    { title: 'Java 基础', desc: '类, main方法, 数据类型, 控制流, 数组', url: 'topics/java.html', icon: '☕', category: 'Java' },
    { title: 'Java OOP', desc: '封装, 继承, 多态, 抽象类, 接口', url: 'topics/java.html#oop', icon: '🏗️', category: 'Java' },
    { title: 'Java 集合框架', desc: 'List, Set, Map, Queue, Collections工具类', url: 'topics/java.html#collections', icon: '🗂️', category: 'Java' },
    { title: 'Java 异常处理', desc: 'try-catch, throw, throws, 自定义异常', url: 'topics/java.html#exceptions', icon: '⚠️', category: 'Java' },
    // C语言
    { title: 'C 语言基础', desc: '变量, 运算符, 控制流, 函数, 数组', url: 'topics/c-language.html', icon: '⚙️', category: 'C语言' },
    { title: 'C 指针', desc: '指针运算, 数组指针, 函数指针, 动态内存', url: 'topics/c-language.html#pointers', icon: '📍', category: 'C语言' },
    { title: 'C 内存管理', desc: 'malloc, calloc, realloc, free, 内存泄漏', url: 'topics/c-language.html#memory', icon: '💾', category: 'C语言' },
    { title: 'C 结构体与文件', desc: 'struct, typedef, 文件读写, 联合体', url: 'topics/c-language.html#structs', icon: '📋', category: 'C语言' },
    // 数据结构与算法
    { title: '数据结构概述', desc: '数组, 链表, 栈, 队列, 树, 图, 哈希表', url: 'topics/data-structures.html', icon: '📊', category: '数据结构' },
    { title: '排序算法', desc: '冒泡, 选择, 插入, 归并, 快排, 堆排序', url: 'topics/data-structures.html#sorting', icon: '🔄', category: '数据结构' },
    { title: '搜索算法', desc: '线性搜索, 二分搜索, BFS, DFS', url: 'topics/data-structures.html#searching', icon: '🔍', category: '数据结构' },
    { title: '树结构', desc: '二叉树, BST, AVL, 红黑树, 堆, Trie', url: 'topics/data-structures.html#trees', icon: '🌳', category: '数据结构' },
    { title: '动态规划', desc: '记忆化搜索, 背包问题, LCS, LIS, 状态DP', url: 'topics/data-structures.html#dp', icon: '🧩', category: '数据结构' },
    // Git
    { title: 'Git 基础命令', desc: 'init, add, commit, status, log, diff', url: 'topics/git.html', icon: '🔗', category: 'Git' },
    { title: 'Git 分支管理', desc: 'branch, checkout, merge, rebase, stash', url: 'topics/git.html#branching', icon: '🌿', category: 'Git' },
    { title: 'Git 远程协作', desc: 'clone, push, pull, fetch, remote, PR', url: 'topics/git.html#remote', icon: '🌐', category: 'Git' },
    { title: 'Git 工作流', desc: 'Git Flow, GitHub Flow, GitLab Flow, 代码审查', url: 'topics/git.html#workflows', icon: '🔄', category: 'Git' },
    // SQL
    { title: 'SQL 基础', desc: 'SELECT, INSERT, UPDATE, DELETE, WHERE', url: 'topics/sql.html', icon: '🗄️', category: 'SQL' },
    { title: 'SQL JOIN', desc: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, 自连接', url: 'topics/sql.html#joins', icon: '🔗', category: 'SQL' },
    { title: 'SQL 聚合与分组', desc: 'GROUP BY, HAVING, COUNT, SUM, AVG, MAX, MIN', url: 'topics/sql.html#aggregation', icon: '📊', category: 'SQL' },
    { title: 'SQL 索引与事务', desc: '索引类型, ACID, 事务隔离级别, 锁机制', url: 'topics/sql.html#advanced', icon: '⚡', category: 'SQL' },
  ];

  if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        searchDropdown.classList.remove('show');
        return;
      }

      const results = searchData.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               item.desc.toLowerCase().includes(query) ||
               item.category.toLowerCase().includes(query);
      });

      if (results.length === 0) {
        searchDropdown.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 14px;">未找到相关内容</div>`;
        searchDropdown.classList.add('show');
        return;
      }

      searchDropdown.innerHTML = results.slice(0, 8).map(item => `
        <a href="${item.url}" class="search-result-item" data-search>
          <span class="result-icon">${item.icon}</span>
          <div class="result-info">
            <h4>${highlightMatch(item.title, query)}</h4>
            <p>${item.category} · ${highlightMatch(item.desc, query)}</p>
          </div>
        </a>
      `).join('');
      searchDropdown.classList.add('show');
    });

    // 点击外部关闭搜索结果
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) {
        searchDropdown.classList.remove('show');
      }
    });

    // 回车键跳转到第一个结果
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstResult = searchDropdown.querySelector('a');
        if (firstResult) {
          window.location.href = firstResult.getAttribute('href');
        }
      }
    });
  }

  function highlightMatch(text, query) {
    const idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return text;
    return text.substring(0, idx) + '<mark>' + text.substring(idx, idx + query.length) + '</mark>' + text.substring(idx + query.length);
  }

  // =========================================
  // 6. 页面锚点平滑滚动
  // =========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // 更新 URL hash
        history.pushState(null, '', targetId);
      }
    });
  });

  // =========================================
  // 7. 页面加载后自动滚动到 hash 位置
  // =========================================
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  }

  // =========================================
  // 8. 交互式代码执行 (仅首页示例)
  // =========================================
  const runBtns = document.querySelectorAll('.run-code-btn');
  runBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block');
      const pre = codeBlock?.querySelector('pre');
      const output = codeBlock?.querySelector('.code-output');
      if (!pre || !output) return;

      const code = pre.textContent;
      try {
        // 检测语言 (通过 lang-label)
        const langLabel = codeBlock.querySelector('.lang-label')?.textContent?.toLowerCase() || '';
        if (langLabel.includes('javascript') || langLabel.includes('js')) {
          const originalLog = console.log;
          const logs = [];
          console.log = (...args) => logs.push(args.map(String).join(' '));
          const result = eval(code);
          console.log = originalLog;
          output.innerHTML = logs.length
            ? logs.join('<br>')
            : (result !== undefined ? String(result) : '✓ 执行成功（无输出）');
        } else {
          output.textContent = '⚠️ 当前仅支持运行 JavaScript 代码示例';
        }
      } catch (err) {
        output.textContent = '❌ 错误: ' + err.message;
      }
    });
  });

  // =========================================
  // 9. 打字动画 (首页)
  // =========================================
  const typeWriter = document.getElementById('typeWriter');
  if (typeWriter) {
    const texts = ['HTML/CSS', 'JavaScript', 'Python', 'Java', 'C/C++', '算法', 'Git', 'SQL'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentText = texts[textIndex];
      if (!isDeleting) {
        typeWriter.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
          isDeleting = true;
          setTimeout(typeEffect, 2000);
          return;
        }
      } else {
        typeWriter.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }
      setTimeout(typeEffect, isDeleting ? 60 : 100);
    }
    typeEffect();
  }

  console.log('📚 编程知识学习网站已加载完成');
  console.log('💡 提示: 使用搜索框快速查找内容');
  console.log('🌙 点击右上角按钮切换暗色模式');
});
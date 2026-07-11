/* ============================================
   听见北京 — 交互逻辑
   - HTML5 Audio 播放真实环境录音
   - 声音地图核心交互（含暂停/继续）
   - 滚动动效 (IntersectionObserver)
   ============================================ */

(function () {
    'use strict';

    /* ---- Audio Playback Engine ---- */

    var currentAudio = null;
    var currentSound = null;
    var currentCard = null;
    var isPaused = false;
    var audioUnlocked = false;

    var audioFiles = {
        axis: 'assets/audio/axis.mp3',
        hutong: 'assets/audio/hutong.mp3',
        city: 'assets/audio/city.mp3',
        night: 'assets/audio/night.mp3'
    };

    var feedbackMessages = {
        axis: '已听见：中轴北京 — 钟声回荡，古都的秩序在空气中延展',
        hutong: '已听见：胡同北京 — 街巷深处的烟火气，城市在耳边醒来',
        city: '已听见：都市北京 — 地铁穿行地下，速度构成城市的脉搏',
        night: '已听见：夜色北京 — 后海酒吧街人声鼎沸，这是城市最鲜活的夜晚'
    };

    /* ---- DOM References ---- */

    var collected = new Set();
    var soundCards = document.querySelectorAll('.sound-card');
    var landmarkCards = document.querySelectorAll('.landmark-card');
    var progressFill = document.getElementById('progressFill');
    var progressText = document.getElementById('progressText');
    var navProgress = document.getElementById('navProgress');
    var feedback = document.getElementById('soundFeedback');
    var completeMsg = document.getElementById('soundComplete');
    var startBtn = document.getElementById('startBtn');
    var audioHint = document.getElementById('audioHint');

    function stopAllSounds() {
        if (currentAudio) {
            try {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            } catch (e) { /* already stopped */ }
            currentAudio = null;
        }
        currentSound = null;
        isPaused = false;
    }

    function clearPlayingStates() {
        soundCards.forEach(function (c) {
            c.classList.remove('playing');
            c.classList.remove('paused');
        });
    }

    function playSound(soundId, cardElement) {
        if (!audioUnlocked) {
            unlockAudio();
        }

        /* if clicking the same card that's currently playing */
        if (currentSound === soundId && currentAudio) {
            if (isPaused) {
                /* resume */
                currentAudio.play().catch(function (err) {
                    console.warn('Audio resume failed:', err);
                });
                isPaused = false;
                if (cardElement) {
                    cardElement.classList.remove('paused');
                    cardElement.classList.add('playing');
                }
                updateCardStatus(cardElement, '播放中');
            } else {
                /* pause */
                currentAudio.pause();
                isPaused = true;
                if (cardElement) {
                    cardElement.classList.remove('playing');
                    cardElement.classList.add('paused');
                }
                updateCardStatus(cardElement, '已暂停 — 点击继续');
            }
            return;
        }

        /* different card: stop current, start new */
        stopAllSounds();
        clearPlayingStates();

        /* add playing class to current card */
        if (cardElement) {
            cardElement.classList.add('playing');
        }
        currentCard = cardElement;
        currentSound = soundId;

        /* create and play audio */
        var src = audioFiles[soundId];
        if (!src) return;

        currentAudio = new Audio(src);
        currentAudio.volume = 0.7;
        currentAudio.loop = true;

        currentAudio.play().then(function () {
            updateCardStatus(cardElement, '播放中');
        }).catch(function (err) {
            console.warn('Audio playback failed:', err);
            updateCardStatus(cardElement, '点击重试');
        });

        /* track collection */
        if (!collected.has(soundId)) {
            collected.add(soundId);
            soundCards.forEach(function (c) {
                if (c.dataset.sound === soundId) {
                    c.classList.add('collected');
                }
            });
            updateProgress();
        }

        /* show feedback */
        showFeedback(feedbackMessages[soundId]);
    }

    function updateCardStatus(card, text) {
        if (!card) return;
        var status = card.querySelector('.sound-card-status');
        if (status) {
            status.textContent = text;
        }
    }

    function showFeedback(message) {
        feedback.textContent = message;
        feedback.classList.add('show');
        clearTimeout(showFeedback.timer);
        showFeedback.timer = setTimeout(function () {
            feedback.classList.remove('show');
        }, 4500);
    }

    function updateProgress() {
        var count = collected.size;
        var percentage = (count / 4) * 100;
        progressFill.style.width = percentage + '%';
        var progressStr = '探索进度 ' + count + '/4';
        progressText.textContent = progressStr;
        navProgress.textContent = progressStr;

        if (count === 4) {
            setTimeout(function () {
                completeMsg.classList.add('show');
            }, 600);
        }
    }

    /* ---- Audio Unlock ---- */

    function unlockAudio() {
        audioUnlocked = true;
        startBtn.classList.add('unlocked');
        startBtn.querySelector('.hero-btn-text').textContent = '声音已开启';
        startBtn.querySelector('.hero-btn-arrow').textContent = '\u2713';
        audioHint.textContent = '向下滚动，探索声音地图';
    }

    startBtn.addEventListener('click', function () {
        if (!audioUnlocked) {
            unlockAudio();
        }
    });

    /* ---- Sound Card Clicks ---- */

    soundCards.forEach(function (card) {
        card.addEventListener('click', function (e) {
            /* if clicking the play/pause button, let it handle separately */
            if (e.target.closest('.sound-card-play-btn')) {
                e.stopPropagation();
                playSound(card.dataset.sound, card);
                return;
            }
            var soundId = card.dataset.sound;
            playSound(soundId, card);
        });

        /* keyboard support */
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playSound(card.dataset.sound, card);
            }
        });
    });

    /* ---- Landmark Card Clicks (also play sounds) ---- */

    landmarkCards.forEach(function (card) {
        card.addEventListener('click', function () {
            var soundId = card.dataset.sound;
            if (soundId) {
                var matchingSoundCard = document.querySelector('.sound-card[data-sound="' + soundId + '"]');
                playSound(soundId, matchingSoundCard);
            }
        });
    });

    /* ---- Scroll Reveal Animation ---- */

    var revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ---- Navigation visibility ---- */

    var nav = document.getElementById('nav');
    var hero = document.getElementById('hero');

    if ('IntersectionObserver' in window) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    nav.classList.add('visible');
                } else {
                    nav.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        navObserver.observe(hero);
    }

    /* ---- Smooth scroll for hero button ---- */

    startBtn.addEventListener('click', function () {
        if (audioUnlocked) {
            var overview = document.getElementById('overview');
            if (overview) {
                setTimeout(function () {
                    overview.scrollIntoView({ behavior: 'smooth' });
                }, 600);
            }
        }
    });

    /* ---- Stop sounds when tab is hidden ---- */

    document.addEventListener('visibilitychange', function () {
        if (document.hidden && currentAudio && !isPaused) {
            currentAudio.pause();
            isPaused = true;
            if (currentCard) {
                currentCard.classList.remove('playing');
                currentCard.classList.add('paused');
                updateCardStatus(currentCard, '已暂停 — 点击继续');
            }
        }
    });

})();

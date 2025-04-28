document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 애니메이션 요소 설정
    const animationElements = document.querySelectorAll('.section-header, .feature-card, .review-card, .reward-card, .faq-item');
    animationElements.forEach(element => {
        element.classList.add('animate-fade-up');
    });
    
    // 스크롤 애니메이션 함수
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        
        animationElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('animated');
            }
        });
    }
    
    // 초기 체크 및 스크롤 이벤트 리스너 추가
    checkScroll();
    window.addEventListener('scroll', checkScroll);

    // 헤더 스크롤 효과
    const header = document.querySelector('header');
    function updateHeader() {
        if (window.scrollY > 50) {
            header.style.padding = '12px 0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.08)';
        }
    }
    
    updateHeader();
    window.addEventListener('scroll', updateHeader);

    // FAQ 토글 기능
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // 현재 활성화된 아이템 닫기
            const currentActive = document.querySelector('.faq-item.active');
            if (currentActive && currentActive !== item) {
                currentActive.classList.remove('active');
                
                // 부드러운 닫힘 효과
                const currentAnswer = currentActive.querySelector('.faq-answer');
                currentAnswer.style.maxHeight = '0';
            }
            
            // 클릭된 아이템 토글
            item.classList.toggle('active');
            
            // 부드러운 토글 효과 추가
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // 네비게이션 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 현재 활성화된 메뉴 항목 강조 처리
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // 부드러운 스크롤
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 활성 메뉴 항목 자동 업데이트
    function updateActiveMenu() {
        const scrollPosition = window.scrollY + 100;
        
        // 각 섹션의 위치 확인 및 해당 메뉴 활성화
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveMenu);

    // 사전등록 폼 제출 처리
    const preRegisterForm = document.getElementById('pre-register-form');
    if (preRegisterForm) {
        preRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // 버튼 상태 변경
            submitButton.disabled = true;
            submitButton.textContent = '처리 중...';
            
            // 실제 구현에서는 서버에 데이터를 전송하는 코드를 작성
            setTimeout(() => {
                // 성공 메시지 표시
                submitButton.textContent = '완료!';
                submitButton.style.backgroundColor = 'var(--success)';
                
                // 알림창 대신 인라인 메시지 표시
                const messageContainer = document.createElement('div');
                messageContainer.className = 'success-message';
                messageContainer.innerHTML = `<p>${email} 주소로 사전등록 완료! 특별 캔디 보너스가 발송될 예정입니다.</p>`;
                messageContainer.style.color = 'var(--white)';
                messageContainer.style.marginTop = '20px';
                messageContainer.style.padding = '15px';
                messageContainer.style.backgroundColor = 'rgba(0, 184, 148, 0.2)';
                messageContainer.style.borderRadius = '10px';
                messageContainer.style.animation = 'fadeIn 0.5s ease';
                
                // 기존 메시지가 있으면 제거
                const existingMessage = document.querySelector('.success-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                // 폼 아래에 메시지 추가
                this.after(messageContainer);
                
                // 폼 초기화 및 버튼 상태 복원
                this.reset();
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        });
    }

    // 리뷰 슬라이더 자동 스크롤
    const reviewsSlider = document.querySelector('.reviews-slider');
    if (reviewsSlider && reviewsSlider.children.length > 0) {
        let isScrolling = false;
        let scrollDirection = 1; // 1: 오른쪽, -1: 왼쪽
        const scrollSpeed = 0.5; // 속도 조절
        
        // 슬라이더 위에 마우스 올릴 때 스크롤 멈추기
        reviewsSlider.addEventListener('mouseenter', () => {
            isScrolling = false;
        });
        
        // 슬라이더에서 마우스 벗어날 때 스크롤 재시작
        reviewsSlider.addEventListener('mouseleave', () => {
            isScrolling = true;
        });
        
        // 자동 스크롤 함수
        function autoScroll() {
            if (isScrolling) {
                reviewsSlider.scrollLeft += scrollSpeed * scrollDirection;
                
                // 스크롤이 끝에 도달하면 방향 전환
                if (
                    (scrollDirection > 0 && reviewsSlider.scrollLeft >= reviewsSlider.scrollWidth - reviewsSlider.clientWidth - 10) ||
                    (scrollDirection < 0 && reviewsSlider.scrollLeft <= 10)
                ) {
                    scrollDirection *= -1;
                }
            }
            requestAnimationFrame(autoScroll);
        }
        
        // 초기에는 스크롤링 활성화
        isScrolling = true;
        autoScroll();
        
        // 터치 스크롤 지원
        let isDown = false;
        let startX;
        let scrollLeft;

        reviewsSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            reviewsSlider.style.cursor = 'grabbing';
            startX = e.pageX - reviewsSlider.offsetLeft;
            scrollLeft = reviewsSlider.scrollLeft;
        });

        reviewsSlider.addEventListener('mouseleave', () => {
            isDown = false;
            reviewsSlider.style.cursor = 'grab';
        });

        reviewsSlider.addEventListener('mouseup', () => {
            isDown = false;
            reviewsSlider.style.cursor = 'grab';
        });

        reviewsSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            reviewsSlider.scrollLeft = scrollLeft - walk;
        });
    }

    // 히어로 섹션 애니메이션
    function animateHero() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent && heroImage) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroImage.style.opacity = '0';
            heroImage.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    heroImage.style.transition = 'all 1s ease';
                    heroImage.style.opacity = '1';
                    heroImage.style.transform = 'translateY(0)';
                }, 300);
            }, 300);
        }
    }
    
    // 페이지 로드 시 히어로 애니메이션 시작
    animateHero();
    
    // 카운터 애니메이션 효과 (숫자 올라가는 효과)
    function createCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = +counter.getAttribute('data-duration') || 2000;
            const increment = target / (duration / 16);
            
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            // 요소가 화면에 보일 때만 카운터 시작
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    // 카운터 요소가 있을 경우 초기화
    if (document.querySelector('.counter')) {
        createCounters();
    }
    
    // 화면 크기에 따른 모바일 메뉴 설정
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // 모바일 메뉴 항목 클릭 시 메뉴 닫기
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }
    
    // 페이지 맨 위로 스크롤하는 버튼
    const scrollTopButton = document.createElement('button');
    scrollTopButton.className = 'scroll-top';
    scrollTopButton.innerHTML = '&uarr;';
    scrollTopButton.title = '페이지 상단으로 이동';
    document.body.appendChild(scrollTopButton);
    
    // 스타일 적용
    scrollTopButton.style.position = 'fixed';
    scrollTopButton.style.bottom = '30px';
    scrollTopButton.style.right = '30px';
    scrollTopButton.style.width = '50px';
    scrollTopButton.style.height = '50px';
    scrollTopButton.style.borderRadius = '50%';
    scrollTopButton.style.backgroundColor = 'var(--primary-color)';
    scrollTopButton.style.color = 'white';
    scrollTopButton.style.border = 'none';
    scrollTopButton.style.fontSize = '24px';
    scrollTopButton.style.cursor = 'pointer';
    scrollTopButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
    scrollTopButton.style.opacity = '0';
    scrollTopButton.style.visibility = 'hidden';
    scrollTopButton.style.transition = 'all 0.3s ease';
    scrollTopButton.style.zIndex = '999';
    
    // 스크롤 위치에 따라 버튼 표시/숨김
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.visibility = 'visible';
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.visibility = 'hidden';
        }
    });
    
    // 버튼 클릭 시 맨 위로 스크롤
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 마우스 오버 효과
    scrollTopButton.addEventListener('mouseover', () => {
        scrollTopButton.style.backgroundColor = 'var(--primary-dark)';
        scrollTopButton.style.transform = 'translateY(-3px)';
        scrollTopButton.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
    });
    
    scrollTopButton.addEventListener('mouseout', () => {
        scrollTopButton.style.backgroundColor = 'var(--primary-color)';
        scrollTopButton.style.transform = 'translateY(0)';
        scrollTopButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
    });

    // 앱 스토어 버튼 클릭 이벤트
    const appStoreButton = document.querySelector('.download-button.app-store');
    appStoreButton.addEventListener('click', function(e) {
        e.preventDefault();
        alert('앱 스토어 버전은 현재 준비 중입니다. 조금만 기다려주세요!');
    });

    // 구글플레이 버튼 클릭 이벤트
    const googlePlayButton = document.querySelector('.download-button.google-play');
    googlePlayButton.addEventListener('click', function(e) {
        e.preventDefault();
        alert('구글플레이 버전은 현재 준비 중입니다. 조금만 기다려주세요!');
    });
}); 
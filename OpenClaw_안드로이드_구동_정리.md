# OpenClaw 안드로이드 구동 정리

> 참고 저장소: https://github.com/AidanPark/openclaw-android
> 목적: **안드로이드 폰에서 OpenClaw를 초보자도 이해하기 쉽게 설치/실행하는 방법** 정리

## 먼저 아주 쉽게 말하면
이 방법은 **안드로이드 폰에 OpenClaw를 올리는 쉬운 설치법**입니다.

보통은 안드로이드에서 리눅스(Ubuntu 같은 것)를 하나 더 깔고 그 안에서 OpenClaw를 돌리는데,
이 프로젝트는 그렇게 하지 않고 **Termux 안에서 바로 OpenClaw가 돌아가게** 만들어 줍니다.

그래서 장점은 이렇습니다.
- 설치가 더 **간단함****
- 저장공간을 덜 먹음
- 속도가 더 자연스러움
- 폰을 OpenClaw 전용 기기처럼 쓰기 쉬움

## 진짜 핵심만 5줄
1. 폰에 **Termux**를 설치한다.
2. Termux에서 설치 명령 **1줄**을 실행한다.
3. `openclaw onboard`로 초기 설정을 한다.
4. `openclaw gateway`로 실행한다.
5. 절전/배터리 최적화를 풀어줘야 오래 살아남는다.

## 한 줄 요약
이 프로젝트는 **Termux 안에 가벼운 glibc 실행환경만 추가**해서, 안드로이드 폰에서도 **별도 Linux 배포판(proot-distro)** 없이 OpenClaw를 돌리게 해주는 설치 방법입니다.

즉,
- 보통 방식: Termux + Ubuntu/Debian(proot) + Node + OpenClaw
- 이 방식: **Termux + glibc runner + Node + OpenClaw**

그래서 더 **가볍고, 빠르고, 설치가 단순**합니다.

---

## 왜 이 방식이 좋은가
기존 안드로이드 구동 방식은 대개:
1. Termux 설치
2. Ubuntu/Debian 같은 Linux 배포판 추가 설치
3. 그 안에서 Node 설치
4. 다시 OpenClaw 설치

이렇게 돌아가서,
- 저장공간을 많이 먹고
- 설정 단계가 많고
- 성능도 약간 손해를 봅니다.

이 저장소의 접근은 **'리눅스 전체를 올리지 말고, OpenClaw가 필요한 glibc 환경만 얹자'** 입니다.

### README 기준 비교
- **저장공간**: 대략 **1~2GB → 약 200MB 수준**
- **설치 시간**: **20~30분 → 3~10분**
- **성능**: proot 오버헤드 없이 **더 자연스럽고 빠름**

---

## 어떤 원리로 돌아가나
안드로이드는 일반 리눅스와 달리 기본 C 라이브러리가 **glibc가 아니라 Bionic** 입니다.
문제는 많은 리눅스용 Node 바이너리와 도구들이 **glibc 기준**으로 만들어진다는 점입니다.

이 프로젝트는 여기서:
- **glibc 전체 배포판**을 까는 대신
- **glibc 런타임/링커(ld.so)** 를 Termux 안에 준비하고
- 그 위에서 **공식 linux-arm64 Node.js** 를 실행하게 만듭니다.

핵심은:
- Node를 안드로이드에서 억지로 컴파일하는 게 아니라
- **리눅스용 Node 바이너리를 glibc runner로 실행**한다는 점입니다.

README에 따르면 설치 스크립트가 자동으로 처리하는 것은 대략 아래입니다.
- glibc 환경 설치
- Node.js(glibc) 다운로드 및 래핑
- `/tmp`, `/bin/sh`, `/usr/bin/env` 같은 경로 차이 보정
- 안드로이드용 temp 폴더 설정
- systemd 없는 환경에 맞춘 우회 처리
- 선택 시 OpenCode 같은 도구도 추가 설치

---

## 필요한 것
- **Android 7.0 이상** (권장: 10 이상)
- 여유 저장공간 약 **1GB**
- 인터넷 연결
- **Termux**

### 중요한 점
**Play Store 버전 Termux는 쓰면 안 되고, F-Droid 버전 Termux를 써야 합니다.**

---

## 초보자용 빠른 설치 순서

### 0) 이걸 왜 쓰나?
OpenClaw를 **안드로이드 폰에서도 실행**하고 싶을 때 씁니다.
쉽게 말해, 폰을 작은 OpenClaw 장치처럼 쓰는 것입니다.

### 1) 뭘 설치하나?
- **Termux**: 안드로이드용 터미널 앱
- **OpenClaw**: 실제로 쓸 본체

### 2) 가장 중요한 명령 3개
아래 3개만 기억하면 됩니다.

```bash
pkg update -y && pkg install -y curl
curl -sL myopenclawhub.com/install | bash && source ~/.bashrc
openclaw onboard
```

실행할 때는 마지막으로:
```bash
openclaw gateway
```

### 3) 초보자 기준 주의할 점
- **Termux는 F-Droid 버전 사용**
- 설치 후 **배터리 최적화 해제**
- gateway는 가능하면 **폰의 Termux 앱 안에서 직접 실행**
- SSH로만 실행하면 연결이 끊길 때 같이 죽을 수 있음

---

## 실제 설치 흐름

### 1) 폰 준비
README는 먼저 아래를 손보라고 권합니다.
- 개발자 옵션
- Stay Awake
- 배터리 최적화 해제
- 백그라운드 프로세스 강제 종료 방지

안드로이드는 화면이 꺼지거나 절전이 걸리면 백그라운드 프로세스를 잘 죽이므로,
**OpenClaw gateway를 오래 띄우려면 이 부분이 중요**합니다.

### 2) Termux 설치
- F-Droid에서 Termux 설치
- **Play Store 버전은 비권장**

### 3) Termux 최초 실행
초기 업데이트와 기본 도구 설치:
```bash
pkg update -y && pkg upgrade -y
pkg install -y curl
```

#### 선택: 저장소 접근 권한
필요하면 아래도 실행:
```bash
termux-setup-storage
```
- 이건 휴대폰 저장소 접근 권한을 여는 용도입니다.
- **OpenClaw 자체 설치에 항상 필수는 아니지만**, 파일 다루기/다운로드/로그 확인에는 도움이 됩니다.

### 4) 설치 스크립트는 가능하면 먼저 읽기
README의 핵심 설치 명령은 아래지만,
```bash
curl -sL myopenclawhub.com/install | bash && source ~/.bashrc
```
보안 관점에서는 바로 실행하기 전에 한 번 읽어보는 습관이 좋습니다.

예:
```bash
curl -sL https://myopenclawhub.com/install | sed -n '1,200p'
```
또는
```bash
curl -sL https://myopenclawhub.com/install -o ~/openclaw-install.sh
less ~/openclaw-install.sh
bash ~/openclaw-install.sh
```

### 5) OpenClaw on Android 설치
검토 후 실행:
```bash
curl -sL myopenclawhub.com/install | bash && source ~/.bashrc
```

이 한 줄로 OpenClaw on Android 환경을 자동 구성합니다.

> 보정 메모:
> - 첨부 참고문서에는 `pkg install -y nodejs`나 `proot` 관련 단계가 있었지만, **원레포의 핵심은 Termux node/proot를 수동으로 준비하는 게 아니라 설치 스크립트가 glibc 기반 Node 실행환경을 맞춰준다는 점**입니다.
> - 따라서 `nodejs` 선설치나 `proot` 설치는 **기본 필수 단계로 적지 않는 편이 정확**합니다.

### 6) OpenClaw 초기 설정
```bash
openclaw onboard
```

여기서 계정/토큰/기본 설정 등을 맞춥니다.

### 7) Gateway 실행
README 기준 권장 방식:
```bash
openclaw gateway
```

중요 포인트:
- **SSH 세션에서 실행하지 말고, 폰의 Termux 앱 자체에서 실행**
- 이유: SSH가 끊기면 gateway도 같이 죽을 수 있음
- Termux에서 **새 탭**을 열어 gateway 전용 세션으로 띄우는 것을 권장

### 8) 좀 더 편하게 운영하려면
#### tmux 사용
포그라운드 실행이 부담되면:
```bash
pkg install -y tmux
tmux new -s openclaw
openclaw gateway
```
- 분리(detach): `Ctrl+b` 후 `d`

#### 부팅 시 자동 시작
- `Termux:Boot` 플러그인을 활용하면 부팅 시 자동 실행 스크립트를 붙일 수 있습니다.
- 다만 이건 **기본 설치보다 한 단계 더 나아간 운영 편의 설정**으로 보는 게 맞습니다.

---

## 실사용할 때 이해해야 할 점

### 1) CLI는 PC보다 느릴 수 있음
README는 `openclaw status` 같은 CLI 명령이 폰에서 좀 느리게 느껴질 수 있다고 설명합니다.
이유는:
- 저장소 속도
- 안드로이드 보안 계층
- 많은 파일 읽기 비용

하지만 **gateway가 한 번 떠 있으면 체감 차이는 훨씬 줄어든다**고 합니다.

### 2) 핵심 성능은 폰이 아니라 클라우드 모델이 결정
OpenClaw는 실제 추론을 보통 OpenAI/Gemini 같은 외부 모델 API에 보내므로,
**응답 속도는 PC와 크게 다르지 않을 수 있습니다.**

즉 폰은:
- 게이트웨이 실행
- 메시지/도구/라우팅 처리
- 세션 유지

역할에 가깝고, 무거운 모델 추론은 외부 서버가 처리합니다.

---

## 업데이트 방법
README 기준 업데이트 명령:
```bash
oa --update && source ~/.bashrc
```

이 명령으로 업데이트되는 대상:
- OpenClaw core
- code-server
- OpenCode
- Claude Code / Gemini CLI / Codex CLI 같은 AI CLI 도구
- 안드로이드 호환 패치

즉, 안드로이드용 OpenClaw 관리 명령은 일반 `openclaw` 외에 **`oa`** 가 보조 관리 명령으로 붙는 구조입니다.

---

## 장점 요약
- **proot-distro 없이 가볍다**
- 설치가 빠르다
- 저장공간을 덜 쓴다
- 성능 손해가 적다
- 안드로이드 폰을 OpenClaw 노드처럼 활용하기 좋다

---

## 한계 / 주의점

### 1) 안드로이드는 백그라운드 프로세스를 잘 죽인다
가장 큰 현실 문제입니다.
그래서:
- 배터리 최적화 해제
- 절전 예외
- 화면 꺼짐/충전 중 동작 정책

이런 운영 설정이 중요합니다.

### 2) 상시 서버처럼 완벽하게 안정적이진 않을 수 있다
폰은 원래 서버 OS가 아니므로,
- 제조사 절전 정책
- 메모리 압박
- 화면 꺼짐 상태
- 네트워크 전환

같은 변수에 영향을 받습니다.

### 3) 로컬 LLM은 가능은 하지만 비추천
README는 `node-llama-cpp` 기반 **로컬 LLM 구동도 기술적으로 가능**하다고 설명하지만,
실사용 제약이 큽니다.
- RAM 부족
- 모델 용량 큼
- CPU-only라 느림
- 저장공간 부담 큼

결론적으로 **실전용은 클라우드 LLM 권장**, 로컬 모델은 실험용 정도로 보는 게 맞습니다.

---

## 이런 사람에게 적합
- 남는 안드로이드 폰을 **OpenClaw 전용 단말/노드**처럼 쓰고 싶은 경우
- 항상 들고 다니는 폰에서 OpenClaw gateway를 띄우고 싶은 경우
- 라즈베리파이/서브 서버 대신 **휴대용 저전력 장치**를 쓰고 싶은 경우
- Termux에 익숙하고, 안드로이드 절전 정책을 직접 만질 수 있는 경우

---

## 설치를 쉽게 이해하는 핵심 문장
이 프로젝트는 **안드로이드에서 리눅스 전체를 에뮬레이션하는 게 아니라, OpenClaw가 돌아갈 만큼의 glibc 실행환경만 얹어서 Termux 안에서 직접 돌리는 방식**입니다.

그래서 **가볍고 빠르지만**, 운영 안정성은 결국 **안드로이드의 백그라운드/절전 정책을 얼마나 잘 다루느냐**에 달려 있습니다.

---

## 개인적 판단
실제로는 다음처럼 이해하면 쉽습니다.

- **실험/휴대성/서브노드 용도**: 매우 매력적
- **24시간 완전 안정 운영**: 폰 제조사 절전 정책 때문에 점검 필요
- **클라우드 LLM 연동용 Gateway 단말**: 꽤 현실적
- **로컬 LLM 본격 운용**: 비효율적

즉, **“폰을 OpenClaw 클라이언트/게이트웨이 단말로 쓰는 용도”에는 상당히 괜찮고, “폰을 본격적인 AI 추론 서버로 쓰는 것”은 비추천**입니다.

---

## 빠른 실행 메모
```bash
pkg update -y && pkg install -y curl
curl -sL myopenclawhub.com/install | bash && source ~/.bashrc
openclaw onboard
openclaw gateway
```

---

## 나중에 확인해볼 포인트
- Termux SSH 같이 열어두고 PC에서 관리하는 방식이 실제 사용성에 더 좋은지
- 특정 제조사(삼성/샤오미 등)에서 백그라운드 유지가 얼마나 안정적인지
- Android 기기를 OpenClaw 보조 노드/음성 단말처럼 쓰는 구성이 실용적인지

# iMessage Family Assistant v1

가족용 iMessage 비서의 1차 구현 골격입니다.

## 지원 기능 (v1)

- 허용된 발신자만 처리
- 장보기 목록: 추가 / 조회 / 완료 / 삭제
- 리마인더: 상대시간(예: 30분 뒤), 절대시간(예: 내일 8시) 기초 파싱
- 일정: 오늘 일정 조회
- 날씨: 오늘/내일 날씨 요청 처리(기본 지역 사용)
- iMessage 답장 문구 생성

## 구성 파일

- `config.json` — 기본 설정
- `allowed_senders.sample.json` — 허용 발신자 예시
- `shopping_list.json` — 장보기 상태
- `state.json` — 마지막 처리 상태
- `assistant.py` — 핵심 처리 엔진
- `cli.py` — 로컬 테스트용 CLI
- `debug_test.py` — self-test 대체용 내부 디버그 실행기

## 빠른 테스트

```bash
cd /Users/jamie/.openclaw/workspace/imessage-assistant
python3 cli.py --sender +821030141521 --text "우유 추가"
python3 cli.py --sender +821030141521 --text "목록 보여줘"
python3 cli.py --sender +821030141521 --text "오늘 일정"
python3 cli.py --sender +821030141521 --text "오늘 날씨"
python3 debug_test.py --text "오늘 날씨" --prefix-test-tag
```

## 실제 운영 연결(다음 단계)

1. Messages 신규 수신 감시기와 연결
2. 허용 번호 JSON 실데이터 채우기
3. cron 또는 watcher로 자동 실행
4. AppleScript 전송기와 응답 연결
5. self-test 안정성을 위해 `poll_inbox.py` 사용 가능 (권장)

## 주의

- 민감한 요청(송금/결제/외부 전송)은 자동 처리하지 않음
- 허용되지 않은 번호는 자동 응답하지 않도록 설계 가능
- 현재 버전은 안전한 로컬 파일 저장 기반 MVP

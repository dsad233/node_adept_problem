**1. 설계: API 명세서 작성**
   API 명세서 작성
  -> https://teamsparta.notion.site/30a75380a5dd4b19922c110388cb6465?v=68786499cb564a0381a79fdcc0320ed8
   전 13조 팀원 분들이랑 API 명세서 작성하였습니다.


   ERD
  -> https://www.erdcloud.com/d/jphsgaXrDWPa7R2cN


**2. 개발-1: 인증 관련 기능 개발**
   회원가입 API: api/register [post]
   로그인 API: api/login [post]
   인증 Middleware: middlewares.js


**3. 개발-2: 사용자 관련 기능 개발**
   내 정보 조회 API: api/acess [get]


**4. 개발-3: 이력서 관련 기능 개발**
   모든 이력서 목록 조회 API: api/resumeacess [get]
   이력서 상세 조회 API: api/resumeacess/:resumeId [get]
   이력서 생성 API (✅ 인증 필요 - middleware 활용): api/resume [post]
   이력서 수정 API (✅ 인증 필요 - middleware 활용): api/resume/:resumeId [put]
   이력서 삭제 API (✅ 인증 필요 - middleware 활용): api/resume/:resumeId [delete]


**5. 테스트: API 호출 도구로 동작 확인**
   -> 완료.  허나 이력서 생성 부분에서 오류가 발생. ( 이력서 생성을 하고, 또 다시 생성 요청 시 create 오류.. if 문으로 조건을 줘서 오류를 피해야 방안을 찾아야 할듯)

**6. 배포: 누구나 이용할 수 있도록 하기**
   aws, pm2 배포에 대해서 더 알아봐야 할 것!



# 환경변수
JWT 숨김 처리도 구현을 해봐야 할 것!


# 더 고민해 보기
1. **암호화 방식**
    - 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
    ->  단 방향!?
      
    - 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
      -> 다른 사람이 볼 때 비밀번호를 쉽게 볼 수 있는 것이 아니라 어렵게 볼 수 있는 점!, 보안성이 올라간다!

      
2. **인증 방식**
    - JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
      -> 보안성의 기능의 장점이 떨어진다.
      
    - 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
      -> 토큰을 공중분해시키거나 무효화 시킨다.


3. **인증과 인가**
    - 인증과 인가가 무엇인지 각각 설명해 주세요.
      -> 인증은 내 정보가 서버와 대조했을 때 그 정보가 일치하는 지를 따지는 것이고, 인가는 정보 인증이 끝이 나고 그 데이터를 다른 곳에서 쓸 수 있게 넘겨주는 것? 이다.
      
    - 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.
     -> 인증에 해당합니다. 토큰을 생성하고 그 토큰이 정보와 동일하면 다음 동작(post, put, delete)도 수행할 수 있는 것이 인가라고 생각합니다.


4. **Http Status Code**
    - 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
     -> res.status(201) = Created 성공
        res.status(400) = Bad Request 좋지 못한 결과
        res.status(404) = Not Found 존재하지 않거나, 서버가 응답을 하지 못할 때


5. **리팩토링**
    - MySQL, Prisma로 개발했는데 MySQL을 MongoDB로 혹은 Prisma 를 TypeORM 로 변경하게 된다면 많은 코드 변경이 필요할까요? 주로 어떤 코드에서 변경이 필요한가요?
      -> 스키마 부분. name String 문자열로 정의를 했는데, MySQL을 MongoDB로 변환했을 때 name varchar(255) 이런식으로 문자열을 지정해줘야 한다.
      
      
		- 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.
     -> 있나요..? 오토젠..?


6. 6. **API 명세서**
    - notion 혹은 엑셀에 작성하여 전달하는 것 보다 swagger 를 통해 전달하면 장점은 무엇일까요?
      -> swagger를 사용하면 보기 쉽게, 이 post 동작은 어떻게 동작하는 것인가!, delete는 어떻게 동작하는가!, get은 무엇 무엇을 불러오는지를 눈으로
      보기 편하게 목록으로, 프론트로 볼 수 있다는 장점이 있다.  https://blog.naver.com/pinmode1247/223345139168     swagger 작성기!


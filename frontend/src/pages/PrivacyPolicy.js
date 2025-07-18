import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        개인정보처리방침
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
        시행일: 2025년 1월 8일
      </Typography>

      <Box sx={{ '& h2': { mt: 4, mb: 2 }, '& p': { mb: 2 } }}>
        <Typography variant="body1" paragraph>
          HOBBYTAN AI(이하 '회사')는 SeedBasket AI 서비스(이하 '서비스')를 제공함에 있어 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </Typography>

        <Typography variant="h5" component="h2">
          제1조 (개인정보의 처리목적)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회원 가입 및 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 회원자격 유지·관리, 서비스 부정이용 방지</li>
            <li>재화 또는 서비스 제공: AI 기반 투자 정보 제공, 맞춤형 투자 분석 서비스 제공, 콘텐츠 제공</li>
            <li>고충처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제2조 (개인정보의 처리 및 보유기간)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회원 가입 및 관리: 회원 탈퇴시까지</li>
            <li>재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산 완료시까지</li>
            <li>전자상거래에서의 계약·청약철회, 대금결제, 재화 등 공급기록: 5년</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제3조 (처리하는 개인정보의 항목)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 다음의 개인정보 항목을 처리하고 있습니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회원가입 시
              <ul>
                <li>필수항목: 이메일 주소, 비밀번호, 이름(닉네임)</li>
                <li>선택항목: 프로필 사진</li>
                <li>자동수집항목: IP주소, 쿠키, 접속일시, 서비스 이용기록</li>
              </ul>
            </li>
            <li>소셜 로그인(Google) 이용 시
              <ul>
                <li>이메일 주소, 이름, 프로필 사진(제공 동의 시)</li>
              </ul>
            </li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제4조 (개인정보의 제3자 제공)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
        </Typography>

        <Typography variant="h5" component="h2">
          제5조 (개인정보처리의 위탁)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 서비스 제공을 위하여 필요한 경우 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>수탁업체: Google Firebase
              <ul>
                <li>위탁업무: 클라우드 서비스 제공, 데이터 저장 및 처리</li>
                <li>보유 및 이용기간: 회원 탈퇴 시 또는 위탁계약 종료 시까지</li>
              </ul>
            </li>
          </ul>
        </Typography>

        <Typography variant="h5" component="h2">
          제6조 (정보주체와 법정대리인의 권리·의무 및 행사방법)
        </Typography>
        <Typography variant="body1" paragraph>
          정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</li>
            <li>정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제7조 (개인정보의 파기)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>파기절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
            <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제8조 (개인정보의 안전성 확보조치)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>개인정보의 암호화: 이용자의 비밀번호는 암호화되어 저장 및 관리되고 있습니다.</li>
            <li>해킹 등에 대비한 기술적 대책: 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하고 있습니다.</li>
            <li>개인정보에 대한 접근 제한: 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있습니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>쿠키의 사용 목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.</li>
            <li>쿠키의 설치·운영 및 거부: 웹브라우저 상단의 도구→인터넷 옵션→개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제10조 (개인정보 보호책임자)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </Typography>
        <Typography variant="body1" component="div">
          <Box sx={{ ml: 2 }}>
            <Typography>▶ 개인정보 보호책임자</Typography>
            <Typography>성명: Pablo Kim</Typography>
            <Typography>직책: 대표</Typography>
            <Typography>연락처: <Link href="mailto:pablo@hobbytan.com">pablo@hobbytan.com</Link></Typography>
            <Typography sx={{ mt: 2 }}>▶ 개인정보 보호 담당부서</Typography>
            <Typography>부서명: 개인정보보호팀</Typography>
            <Typography>담당자: Pablo Kim</Typography>
            <Typography>연락처: <Link href="mailto:pablo@hobbytan.com">pablo@hobbytan.com</Link></Typography>
          </Box>
        </Typography>

        <Typography variant="h5" component="h2">
          제11조 (개인정보 열람청구)
        </Typography>
        <Typography variant="body1" paragraph>
          정보주체는 「개인정보 보호법」 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다.
        </Typography>
        <Typography variant="body1" component="div">
          <Box sx={{ ml: 2 }}>
            <Typography>▶ 개인정보 열람청구 접수·처리 부서</Typography>
            <Typography>부서명: 개인정보보호팀</Typography>
            <Typography>담당자: Pablo Kim</Typography>
            <Typography>연락처: <Link href="mailto:pablo@hobbytan.com">pablo@hobbytan.com</Link></Typography>
          </Box>
        </Typography>

        <Typography variant="h5" component="h2">
          제12조 (권익침해 구제방법)
        </Typography>
        <Typography variant="body1" paragraph>
          정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
            <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
            <li>경찰청: (국번없이) 182 (ecrm.cyber.go.kr)</li>
          </ul>
        </Typography>

        <Typography variant="h5" component="h2">
          제13조 (개인정보처리방침 변경)
        </Typography>
        <Typography variant="body1" paragraph>
          이 개인정보처리방침은 2025년 1월 8일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
        </Typography>

        <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" align="center">
            HOBBYTAN AI
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="https://hobbytan.com" target="_blank" rel="noopener">
              https://hobbytan.com
            </Link>
          </Typography>
          <Typography variant="body2" align="center">
            대표: Pablo Kim | 이메일: <Link href="mailto:pablo@hobbytan.com">pablo@hobbytan.com</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        서비스 이용약관
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
        시행일: 2025년 1월 8일
      </Typography>

      <Box sx={{ '& h2': { mt: 4, mb: 2 }, '& p': { mb: 2 } }}>
        <Typography variant="h5" component="h2">
          제1조 (목적)
        </Typography>
        <Typography variant="body1" paragraph>
          이 약관은 HOBBYTAN AI(이하 "회사")가 제공하는 SeedBasket AI 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Typography>

        <Typography variant="h5" component="h2">
          제2조 (정의)
        </Typography>
        <Typography variant="body1" component="div">
          이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
          <ol>
            <li>"서비스"란 회사가 제공하는 AI 기반 투자 정보 분석 및 제공 서비스인 SeedBasket AI를 의미합니다.</li>
            <li>"회원"이란 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
            <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 이메일 주소를 의미합니다.</li>
            <li>"비밀번호"란 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 비밀보호를 위해 회원 자신이 정한 문자 또는 숫자의 조합을 의미합니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제3조 (약관의 게시와 개정)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
            <li>회사는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
            <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제4조 (약관의 해석)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사는 개별 서비스에 대해서는 별도의 이용약관 및 정책을 둘 수 있으며, 해당 내용이 이 약관과 상충할 경우에는 개별 서비스의 이용약관을 우선하여 적용합니다.</li>
            <li>이 약관에서 정하지 아니한 사항이나 해석에 대해서는 관련법령 또는 상관례에 따릅니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제5조 (이용계약 체결)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
            <li>회사는 가입신청자의 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다. 다만, 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
              <ul>
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                <li>14세 미만 아동이 법정대리인의 동의를 얻지 아니한 경우</li>
                <li>이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며 신청하는 경우</li>
              </ul>
            </li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제6조 (회원정보의 변경)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회원은 서비스 내 프로필 관리 화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.</li>
            <li>회원은 회원가입신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로 회사에 대하여 그 변경사항을 알려야 합니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제7조 (개인정보보호 의무)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법 및 회사의 개인정보처리방침이 적용됩니다.
        </Typography>

        <Typography variant="h5" component="h2">
          제8조 (회원의 아이디 및 비밀번호의 관리에 대한 의무)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회원의 아이디와 비밀번호에 관한 관리책임은 회원에게 있으며, 이를 제3자가 이용하도록 하여서는 안 됩니다.</li>
            <li>회사는 회원의 아이디가 개인정보 유출 우려가 있거나, 반사회적 또는 미풍양속에 어긋나거나 회사 및 회사의 운영자로 오인할 우려가 있는 경우, 해당 아이디의 이용을 제한할 수 있습니다.</li>
            <li>회원은 아이디 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를 즉시 회사에 통지하고 회사의 안내에 따라야 합니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제9조 (회원에 대한 통지)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사가 회원에 대한 통지를 하는 경우 이 약관에 별도 규정이 없는 한 회원이 지정한 전자우편주소로 할 수 있습니다.</li>
            <li>회사는 회원 전체에 대한 통지의 경우 7일 이상 서비스 초기화면에 게시함으로써 제1항의 통지에 갈음할 수 있습니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제10조 (회사의 의무)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사는 관련법과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.</li>
            <li>회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보보호를 위해 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.</li>
            <li>회사는 서비스이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 처리하여야 합니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제11조 (회원의 의무)
        </Typography>
        <Typography variant="body1" component="div">
          회원은 다음 행위를 하여서는 안 됩니다.
          <ol>
            <li>신청 또는 변경 시 허위내용의 등록</li>
            <li>타인의 정보도용</li>
            <li>회사가 게시한 정보의 변경</li>
            <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
            <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
            <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            <li>회사의 동의 없이 영리를 목적으로 서비스를 사용하는 행위</li>
            <li>기타 불법적이거나 부당한 행위</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제12조 (서비스의 제공 등)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사는 회원에게 아래와 같은 서비스를 제공합니다.
              <ul>
                <li>AI 기반 투자 정보 분석 서비스</li>
                <li>실시간 시장 데이터 제공 서비스</li>
                <li>투자 일기 작성 및 관리 서비스</li>
                <li>뉴스 분석 및 영향도 예측 서비스</li>
                <li>기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
              </ul>
            </li>
            <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
            <li>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제13조 (서비스의 변경)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 변경할 수 있습니다.</li>
            <li>서비스의 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우에는 변경사유, 변경될 서비스의 내용 및 제공일자 등은 그 변경 전에 해당 서비스 내 공지사항 화면 등 회원이 충분히 인지할 수 있는 방법으로 게시합니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제14조 (정보의 제공 및 광고의 게재)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사는 회원이 서비스 이용 중 필요하다고 인정되는 다양한 정보를 공지사항이나 전자우편 등의 방법으로 회원에게 제공할 수 있습니다.</li>
            <li>회사는 서비스의 운영과 관련하여 서비스 화면, 홈페이지, 전자우편 등에 광고를 게재할 수 있습니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제15조 (게시물의 저작권)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</li>
            <li>회원은 서비스를 이용하여 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제16조 (투자 정보 관련 면책)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사가 제공하는 모든 투자 정보는 참고용이며, 투자 권유나 추천이 아닙니다.</li>
            <li>회원은 본 서비스에서 제공하는 정보를 바탕으로 한 투자 결정에 대한 모든 책임을 부담합니다.</li>
            <li>회사는 회원의 투자 결과에 대하여 어떠한 책임도 지지 않습니다.</li>
            <li>회사가 제공하는 AI 분석 결과는 예측이며, 실제 시장 상황과 다를 수 있습니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제17조 (계약해제, 해지 등)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회원은 언제든지 서비스 내 "계정 설정" 메뉴를 통해 이용계약 해지 신청을 할 수 있으며, 회사는 관련법 등이 정하는 바에 따라 이를 즉시 처리하여야 합니다.</li>
            <li>회원이 계약을 해지할 경우, 관련법 및 개인정보처리방침에 따라 회사가 회원정보를 보유하는 경우를 제외하고는 해지 즉시 회원의 모든 데이터는 소멸됩니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제18조 (이용제한 등)
        </Typography>
        <Typography variant="body1" paragraph>
          회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
        </Typography>

        <Typography variant="h5" component="h2">
          제19조 (책임제한)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
            <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
            <li>회사는 회원이 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          제20조 (준거법 및 재판관할)
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>회사와 회원 간 제기된 소송은 대한민국법을 준거법으로 합니다.</li>
            <li>회사와 회원 간 발생한 분쟁에 관한 소송은 민사소송법 상의 관할법원에 제소합니다.</li>
          </ol>
        </Typography>

        <Typography variant="h5" component="h2">
          부칙
        </Typography>
        <Typography variant="body1" paragraph>
          이 약관은 2025년 1월 8일부터 시행됩니다.
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
            대표: Pablo Kim | 문의: <Link href="mailto:pablo@hobbytan.com">pablo@hobbytan.com</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default TermsOfService;
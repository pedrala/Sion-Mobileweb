<template>
	<el-container>
		<div class="content guide mob">
			<h1 class="title">GUIDE</h1>

			<div class="guide-heading depth01">
				<h2 class="title">Heading</h2>
			</div>
			<div class="heading depth01">
				<h2 class="title">Heading depth01</h2>
			</div>
			<div class="heading depth02">
				<h3 class="title">Heading depth02</h3>
			</div>

			<div class="guide-heading depth01">
				<h2 class="title">Text</h2>
			</div>
			<div class="guide-heading depth02">
				<h3 class="title">Text Color</h3>
			</div>
			<span class="color01" style="background: black">color01</span>
			<span class="color02">color02</span>
			<span class="color03">color03</span>
			<span class="color04">color04</span>
			<span class="color05">color05</span>
			<span class="color06">color06</span>
			<span class="color07">color07</span>
			<div class="guide-heading depth02">
				<h3 class="title">Text Link</h3>
			</div>
			<el-link href="/" class="text-link" :underline="false">Text link</el-link>
			<br>
			<el-button type="text" @click="goDetail" class="text-link color02">자세히 보기</el-button>
			<el-button type="text" @click="goDetail" class="text-link color04">자세히 보기</el-button>
			<el-button type="text" @click="goDetail" class="text-link color07">자세히 보기</el-button>

			<ul class="text-etc">
				<li>text</li>
				<li>text</li>
			</ul>

			<div class="guide-heading depth01">
				<h2 class="title">Bullet</h2>
			</div>
			<ul class="bullet bullet-type01">
				<li>bullet type01</li>
			</ul>
			<ul class="bullet bullet-type01 bullet-color02">
				<li>bullet color02</li>
			</ul>
			<ul class="bullet bullet-type01 bullet-color02 color04">
				<li>bullet color02</li>
			</ul>

			<ul class="bullet bullet-sizeM bullet-type01 bullet-color02">
				<li>bullet color02</li>
			</ul>

			<div class="guide-heading depth01">
				<h2 class="title">Certifi</h2>
			</div>
			<el-button class="certifi">
				<i class="icon-phone"></i>
				<strong class="name">휴대폰 본인인증</strong>
			</el-button>

			<div class="guide-heading depth01">
				<h2 class="title">Jumbotron</h2>
			</div>
			<!-- jumbotron -->
			<div class="jumbotron bg02 full">
				<strong>
					전문가를 통해 제공받는<br>
					프리미엄 전략 코칭 서비스
				</strong>
				<p>시세 움직임을 빠르게 탐지하고 대응하는 24시간 자동매매 시스템</p>
				<div class="btns justify">
					<el-button class="button button-bg02">온프로 소개</el-button>
				</div>
			</div>
			<!-- //jumbotron -->

			<div class="guide-heading depth01">
				<h2 class="title">MSG</h2>
			</div>
			<div class="guide-heading depth02">
				<h3 class="title">MSG Success</h3>
			</div>
			<div class="msg">
				<i class="icon-msg-success"></i>
				<strong class="title">시온 서비스 회원이 되신것을 환영합니다!</strong>
				<p>
					코벡스 회원님 환영합니다.<br>
					향후 가입 시 등록한 이메일 주소 또는 정보 변경을 원하시면,<br>
					마이페이지 > 회원정보 에서 수정이 가능합니다.<br>
					<br>
					이제 로그인 후 다양한 서비스를 이용해보세요!
				</p>
				<el-button class="button button-bg03 block">로그인</el-button>
			</div>
			<div class="guide-heading depth02">
				<h3 class="title">MSG Error</h3>
			</div>
			<div class="msg">
				<i class="icon-msg-error"></i>
				<strong class="title">죄송합니다.</strong>
				<p>현재 페이지가 존재하지 않거나, 이용할 수 없는 페이지 입니다.</p>
				<el-button class="button button-bg03 block">메인페이지로 이동</el-button>
			</div>

			<div class="guide-heading depth02">
				<h3 class="title">MSG Text</h3>
			</div>
			<!-- msg-text -->
			<div class="msg-text alignC">
				<strong class="title">
					<span class="color02">3000</span> 푸이트가 충전되었습니다.
				</strong>
				<p>포인트 내역은 <span class="color04">마이페이지 > 보유포인트</span> 에서 확인하실 수 있습니다.</p>
			</div>
			<!-- //msg-text -->

			<div class="guide-heading depth01">
				<h2 class="title">Badge</h2>
			</div>
			<span class="badge">성장성 1등급</span>
			<span class="badge badge-bg01">성장성 1등급</span>
			<span class="badge badge-bg02">안정성 1등급</span>
			<span class="badge badge-bg03">효율성 1등급</span>

			<div class="guide-heading depth01">
				<h2 class="title">Button</h2>
			</div>
			<div class="guide-heading depth02">
				<h3 class="title">Button Type</h3>
			</div>
			<el-button class="button">Default</el-button>
			<el-button class="button button-type02">button type02</el-button>

			<div class="guide-heading depth02">
				<h3 class="title">Button State</h3>
			</div>
			<el-button class="button">Default</el-button>
			<el-button class="button" disabled>button type02</el-button>

			<div class="guide-heading depth02">
				<h3 class="title">Button Size</h3>
			</div>
			<el-button class="button">Default</el-button>
			<el-button class="button button-sizeXS">button sizeXS</el-button>
			<el-button class="button button-sizeS">button sizeS</el-button>
			<el-button class="button button-sizeL">button sizeL</el-button>

			<div class="guide-heading depth02">
				<h3 class="title">Button Color &amp; Border</h3>
			</div>
			<el-button class="button button-border01" style="background-color: #fcc;">border border01</el-button>
			<el-button class="button button-border02">border border02</el-button>

			<div class="guide-heading depth02">
				<h3 class="title">Button Bg</h3>
			</div>
			<el-button class="button button-bg01">border button-bg01</el-button>
			<el-button class="button button-bg02">border button-bg02</el-button>
			<el-button class="button button-bg03">border button-bg03</el-button>
			<el-button class="button button-bg04">border button-bg04</el-button>
			<el-button class="button button-bg05">border button-bg05</el-button>
			<el-button class="button button-bg06">border button-bg06</el-button>

			<div class="guide-heading depth02">
				<h3 class="title">Button Icon</h3>
			</div>
			<el-button class="button button-bg01">
				border icon-arrow
				<i class="icon-arrow"></i>
			</el-button>
			<el-button class="button button-bg01">
				border icon-arrow02
				<i class="icon-arrow02"></i>
			</el-button>
			<el-button class="button button-bg02">
				border icon-arrow03
				<i class="icon-arrow03"></i>
			</el-button>
			<el-button class="button button-bg02">
				border icon-arrow04
				<i class="icon-arrow04"></i>
			</el-button>
			<br>
			<br>
			<el-button class="button button-bg01">
				border icon-down01
				<i class="icon-down01"></i>
			</el-button>
			<el-button class="button">
				<i class="icon-tv"></i>
				방송보기
			</el-button>

			<div class="guide-heading depth01">
				<h2 class="title">Form</h2>
			</div>
			<div class="guide-heading depth02">
				<h3 class="title">Input</h3>
			</div>
			<el-input placeholder="Please input" v-model="input" class="input" clearable></el-input>
			<br>
			<br>
			<el-date-picker v-model="value1" type="date" placeholder="날짜선택" class="input input-date"></el-date-picker>

			<div class="guide-heading depth02">
				<h3 class="title">CheckBox</h3>
			</div>
			<el-checkbox v-model="checked1">Option</el-checkbox>
			<el-checkbox v-model="checked2" class="checkbox">Option</el-checkbox>
			<el-checkbox v-model="checked3" class="checkbox-star"></el-checkbox>

			<div class="guide-heading depth02">
				<h3 class="title">Switch</h3>
			</div>
			<el-switch v-model="value2" class="switch"></el-switch>

			<div class="guide-heading depth02">
				<h3 class="title">Radio</h3>
			</div>
			<el-radio v-model="radio" label="1" class="radio">Option A</el-radio>
			<el-radio v-model="radio" label="2" class="radio">Option B</el-radio>

			<div class="guide-heading depth02">
				<h3 class="title">Select</h3>
			</div>
			<el-select v-model="value" placeholder="Select" class="select select-sizeS">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="value" placeholder="Select" class="select">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>

			<div class="guide-heading depth02">
				<h3 class="title">Search box</h3>
			</div>
			<div class="search-box">
				<div class="item in-button">
					<el-input v-model="searchText" :placeholder="$t('cs.a001')" class="input"></el-input>
					<el-button @click="goSearch" class="button button-bg02">{{ $t("cs.a002") }}</el-button>
				</div>
				<div class="item item-dates">
					<el-date-picker v-model="start_dt" type="date" placeholder="날짜선택" class="input input-date"></el-date-picker>
					<span class="demonstration"> ~ </span>
					<el-date-picker v-model="end_dt" type="date" placeholder="날짜선택" class="input input-date"></el-date-picker>
				</div>
				<div class="item">
					<el-button class="button button-bg02 block">조회하기</el-button>
				</div>
			</div>

			<div class="guide-heading depth02">
				<h3 class="title">Box List</h3>
			</div>
			<div class="box-list">
				<div class="item">
					수신자
					<div class="right">설치여부</div>
				</div>
				<div class="item">
					Dr.Chart
					<div class="right">설치</div>
				</div>
				<div class="item">
					Dr.Chart
					<div class="right">설치</div>
				</div>
			</div>

			<div class="guide-heading depth02">
				<h3 class="title">Box List02</h3>
			</div>
			<div class="box-list02">
				<div class="inner">
					<strong class="title">수신자</strong>
					<ul class="bullet bullet-sizeM bullet-type01 bullet-color02">
						<li>text</li>
					</ul>
				</div>
			</div>

			<div class="guide-heading depth02">
				<h3 class="title">Box Etc</h3>
			</div>
			<div class="box-etc">
				<div class="item">
					<span class="name">Onclose</span>
					<p>매수진입 : 신호가격 + 1</p>
					<p>매도진입 : 신호가격 + 1 </p>
				</div>
			</div>

			<div class="guide-heading depth02">
				<h3 class="title">Line Box</h3>
			</div>
			<div class="line-box">
				<div class="item">
					<p>text</p>
					<div class="foot">0000.00.00</div>
				</div>
			</div>

			<div class="guide-heading depth02">
				<h3 class="title">Line Box02</h3>
			</div>
			<!-- line-box02 -->
			<div class="line-box02">
				<div class="item"><strong class="name">가입비</strong> : <span class="color04">0</span>원</div>
				<div class="item"><strong class="name">PC 수수료</strong> : 체결 금액의 <span class="color04">0.09%</span> 포인트 차감</div>
				<div class="item"><strong class="name">서버 수수료</strong> : 체결 금액의 <span class="color04">0.09%</span> 포인트 차감 </div>
			</div>
			<!-- //line-box02 -->

			<div class="guide-heading depth02">
				<h3 class="title">Terms / Terms List</h3>
			</div>

			<!-- terms -->
			<div class="terms">
				<strong class="title">목적</strong>
				<p>결제 수단의 처리 및 요금 정산 (정보통신망 이용촉진 및 정보 보호 등에 관한 법률에 의거)</p>
				<strong class="title">제공되는 정보 보유 및 이용기간</strong>
				<p>결제일 기준 5년</p>
				<strong class="title">정보를 제공받는자</strong>
				<p>홍길동</p>
				<strong class="title">제공되는 정보</strong>
				<p>결제자ID, 결제자명, 결제자의 IP 주소, 결제비밀번호, 휴대폰 번호, 이메일주소</p>
			</div>
			<!-- //terms -->

			<br>

			<div class="terms-list">
				<ul>
					<li>
						<el-checkbox title="[필수] 시그널메이커 이용약관" class="checkbox">[필수] 시그널메이커 이용약관</el-checkbox>
						<el-button class="button button-text">
							내용보기
							<i class="icon-arrow01"></i>
						</el-button>
					</li>
					<li>
						<el-checkbox title="[필수] 시그널메이커 이용약관" class="checkbox">[필수] 시그널메이커 이용약관</el-checkbox>
						<el-button class="button button-text">
							내용보기
							<i class="icon-arrow01"></i>
						</el-button>
					</li>
				</ul>
			</div>

			<br>

			<!--신규회원 가입 -->
			<el-form :class="{'en': $i18n.locale === 'en'}">
				<div class="guide-heading depth02">
					<h3 class="title">신규 회원가입</h3>
				</div>
				<p>회원가입을 위해 <span class="color02">*필수 입력 정보</span>를 정확하게 입력해주세요.</p>
				<!-- form -->
				<div class="form">
					<div class="item">
						<span class="name">
							아이디
							<strong class="color02">*</strong>
						</span>
						<div class="in-button">
							<el-input type="email" v-model="user_id" title="아이디" placeholder="영문/숫자 조합 6~16자리" auto-complete="off" maxlength="60" class="input" required></el-input>
							<el-button @click="confirmIdClicked('userid')" class="button">중복확인</el-button>
						</div>
					</div>
					<div class="item">
						<span class="name">
							필명
							<strong class="color02">*</strong>
						</span>
						<div class="in-button">
							<el-input type="email" v-model="nick_nm" title="필명" placeholder="한글/영문/숫자2~20자리혼용" auto-complete="off" maxlength="60" class="input" required></el-input>
							<el-button @click="confirmIdClicked('nick')" class="button">중복확인</el-button>
						</div>
					</div>
					<div class="item">
						<span class="name">
							비밀번호
							<strong class="color02">*</strong>
						</span>
						<el-input type="password" v-model="user_pw" title="비밀번호" placeholder="영문/숫자/특수문자 조합 8~16자리" auto-complete="new-password" maxlength="16" class="input" required></el-input>
					</div>
					<div class="item">
						<span class="name">
							비밀번호 확인
							<strong class="color02">*</strong>
						</span>
						<el-input type="password" v-model="user_pw2" title="비밀번호 확인" placeholder="입력하신 비밀번호를 다시 한번 입력해주세요." auto-complete="new-password" maxlength="16" class="input" required></el-input>
					</div>
					<div class="item">
						<span class="name">
							이름
							<strong class="color02">*</strong>
						</span>
						<el-input type="text" v-model="user_nm" title="이름" auto-complete="off" maxlength="60" class="input" disabled required></el-input>
					</div>
					<div class="item">
						<span class="name">
							휴대폰번호
							<strong class="color02">*</strong>
						</span>
						<el-input type="text" v-model="user_phone" auto-complete="off" maxlength="60" class="input" disabled required></el-input>
					</div>
					<div class="item">
						<span class="name" style="top:26px;">
							이메일
							<strong class="color02">*</strong>
						</span>
						<el-input type="email" v-model="user_email" title="이메일 아이디" placeholder="이메일 입력" auto-complete="off" maxlength="60" class="input" required></el-input>
					</div>
					<el-button @click.native.prevent="registerClicked" :loading="registering" class="button button-bg03 block">회원가입</el-button>
				</div>
				<!-- //form -->
			</el-form>

			<div class="guide-heading depth01">
				<h2 class="title">Graph graph-Bar</h2>
			</div>

			<div class="list-graph-bar">
				<div class="item">
					<span class="name">성장성</span>
					<span class="graph-bar">
						<span class="no01"></span>
					</span>
				</div>
				<div class="item">
					<span class="name">안정성</span>
					<span class="graph-bar bar-color02">
						<span class="no02"></span>
					</span>
				</div>
				<div class="item">
					<span class="name">효율성</span>
					<span class="graph-bar bar-color03">
						<span class="no03"></span>
					</span>
				</div>
			</div>

			<div class="guide-heading depth01">
				<h2 class="title">Modal</h2>
			</div>
			<el-button type="text" @click="modal = true">modal</el-button>
			<el-dialog title="Tips" :visible.sync="modal" width="100%" top="0" :before-close="handleClose" class="mob modal">
				<div class="section">
					<p>This is a message</p>
					<div slot="footer" class="dialog-footer">
						<el-button @click="modal = false">Cancel</el-button>
						<el-button type="primary" @click="modal = false">Confirm</el-button>
					</div>
				</div>
			</el-dialog>

			<br>

			<el-button type="text" @click="modal2 = true">modal type02</el-button>
			<el-dialog :visible.sync="modal2" width="80%" top="0" :before-close="handleClose" class="mob modal modal-type02" append-to-body>
				<div slot="title" class="modal-head">
					<h2 class="title">커스텀 제목</h2>
				</div>
				<div class="modal-body">
					<div class="inner">
						<ul>
							<li>1. 모든 주문은 서버를 통해 발동되기 때문에, 사용자가 취소하기 전까지는 계속 유지됩니다.</li>
							<li>2. 다른 주문 창에서 거래소 주문을 정정하거나 취소할 경우와 상관없이 전략의 신호에 의해 주문이 전송됩니다.</li>
							<li>3. 시스템을 이용하시기 전에 반드시 이용 방법을 숙지하시어 이용에 착오가 없으시기 바라며, 이 시스템은 매매주문을 내는 시스템일 뿐 시세 변동 또는 시장상황에 따라 실제 매매체결은 이루어지지 않을 수 있습니다.</li>
							<li>4. 자동주문 감시 시작 및 중단을 원칙적으로 사용자만 입력할 수 있지만 전산장애 등 주문불가 상황이 지속될 경우 당사는 등록조건을 모두 임의 해지 할 수 있습니다.</li>
							<li>5. 네트워크 장애, 천재지변, 사용자 모바일 환경, 유의사항 미숙지 등의 사유로 인해 정상적인 작동이 되지 않을 경우 발생한 손해는 당사에서 책임지지 않습니다.</li>
						</ul>
						<div class="btns full">
							<el-button @click="modal2 = false" class="button button-bg06 block">취소</el-button>
						</div>
					</div>
				</div>
			</el-dialog>

			<br>

			<el-button type="text" @click="modal3 = true">modal type03</el-button>
			<el-dialog :visible.sync="modal3" width="100%" top="0" :before-close="handleClose" class="mob modal modal-type03" append-to-body>
				<div slot="title" class="modal-head">
					<h2 class="title">커스텀 제목</h2>
				</div>
				<div class="modal-body">
					<p>This is a message</p>
					<div slot="footer" class="btns justify">
						<el-button @click="modal3 = false" class="button">Cancel</el-button>
						<el-button type="primary" @click="modal = false" class="button button-bg03">Confirm</el-button>
					</div>
				</div>
			</el-dialog>

			<div class="guide-heading depth01">
				<h2 class="title">Tab</h2>
			</div>
			<div class="guide-heading depth02">
				<h3 class="title">Tab Type</h3>
			</div>
			<el-tabs type="card" class="tabs tabs-item02">
				<el-tab-pane label="Tab 01">
					tab content01
				</el-tab-pane>
				<el-tab-pane label="Tab 02">
					tab content02
				</el-tab-pane>
			</el-tabs>

			<el-tabs type="card" class="tabs tabs-color02 tabs-item03">
				<el-tab-pane label="Tab 01">
					tab content01
				</el-tab-pane>
				<el-tab-pane label="Tab 02">
					tab content02
				</el-tab-pane>
				<el-tab-pane label="Tab 03">
					tab content03
				</el-tab-pane>
			</el-tabs>

			<el-tabs type="card" class="tabs tabs-sub tabs-board tabs-color02 tabs-item03 full">
				<el-tab-pane label="Tab 01">
					board-content
				</el-tab-pane>
				<el-tab-pane label="Tab 02">
					board-content
				</el-tab-pane>
				<el-tab-pane label="Tab 03">
					board-content
				</el-tab-pane>
			</el-tabs>

			<div class="guide-heading depth01">
				<h2 class="title">Board Caption</h2>
			</div>
			<!-- board-caption -->
			<div class="board-caption">
				<div class="right">
					현재 운용중인 전략 : <span class="color04">4</span>건
				</div>
			</div>
			<!-- //board-caption -->

			<div class="guide-heading depth01">
				<h2 class="title">Board List</h2>
			</div>
			<div class="board-list">
				<ul>
					<li class="no-data">정보 없음</li>
					<li class="notice">
						<el-link>
							<strong class="title">제목</strong>
							<p>내용</p>
							<div class="foot">
								<span>0000.00.00</span>
							</div>
						</el-link>
					</li>
					<li>
						<el-link>
							<strong class="title">제목</strong>
							<p>내용</p>
							<div class="foot">
								<span>0000.00.00</span>
							</div>
						</el-link>
					</li>
					<li class="items">
						<strong class="title">제목</strong>
						<p>내용</p>
						<div class="btns justify">
							<el-button class="button button-sizeS button-bg02">자동연장 신청</el-button>
							<el-button class="button button-sizeS button-bg04">서비스 해지</el-button>
						</div>
					</li>
					<li class="items">
						<strong class="title">제목</strong>
						<p>내용</p>
						<div class="foot">
							<ul class="right depth">
								<li>자동연장신청</li>
								<li>서비스해지</li>
							</ul>
						</div>
					</li>
				</ul>
			</div>

			<div class="guide-heading depth01">
				<h2 class="title">Board List02</h2>
			</div>
			<div class="board-list02">
				<ul>
					<li>
						<el-link>
							<strong class="title">제목</strong>
							<p>내용</p>
							<div class="foot">
								<span>0000.00.00</span>
							</div>
						</el-link>
					</li>
					<li>
						<el-link>
							<strong class="title">비트코인 MACD 매매 볼린저밴드터치 전략</strong>
							<div class="item">
								<span>거래소 : Bitmex</span>
								<span>종목: XBT/USD</span>
							</div>
							<div class="item">
								<span>누적수익률 : 0%</span>
								<span>누적실행일 : 0일</span>
							</div>
						</el-link>
					</li>
					<li class="items">
						<strong class="title">비트코인 MACD 매매 볼린저밴드터치 전략</strong>
						<span class="space">거래소 : Bitmex</span>
						종목: XBT/USD
					</li>
				</ul>
			</div>

			<div class="guide-heading depth01">
				<h2 class="title">Board View</h2>
			</div>
			<!-- board-view -->
			<div class="board-view">
				<el-form ref="form" :model="data">
					<!-- board-head -->
					<div class="board-head">
						<p class="title">제목</p>
						<div class="date">
							<span>작성자</span>
							<span>조회수 : 0</span>
						</div>
					</div>
					<!-- //board-head -->
					<!-- board-body -->
					<div class="board-body">
						내용
					</div>
					<!-- //board-body -->
					<!-- btns -->
					<div class="btns">
						<el-button @click="goList" class="button button-bg02 block">목록보기</el-button>
					</div>
					<!-- //btns -->
				</el-form>
			</div>
			<!-- //board-view -->

			<div class="guide-heading depth01">
				<h2 class="title">Table</h2>
			</div>

			<el-table :data="tableData01" v-loading="listLoading" class="table">
				<el-table-column prop="date" label="Date"></el-table-column>
				<el-table-column prop="name" label="Name"></el-table-column>
				<el-table-column prop="address" label="Address" align="left"></el-table-column>
			</el-table>

			<el-table :data="tableData01" v-loading="listLoading" border class="table">
				<el-table-column prop="date" label="Date"></el-table-column>
				<el-table-column prop="name" label="Name"></el-table-column>
				<el-table-column prop="address" label="Address"></el-table-column>
			</el-table>

			<el-table :data="tableData01" v-loading="listLoading" border :show-header="false" class="table">
				<el-table-column prop="date" label="Date"></el-table-column>
				<el-table-column prop="name" label="Name"></el-table-column>
				<el-table-column prop="address" label="Address"></el-table-column>
			</el-table>

			<br>
			<br>

			<el-table :data="tableData01" v-loading="listLoading" border class="table table-type02">
				<el-table-column prop="date" label="Date"></el-table-column>
				<el-table-column prop="name" label="Name"></el-table-column>
				<el-table-column prop="address" label="Address"></el-table-column>
			</el-table>

			<br>
			<br>

			<!-- table -->
			<el-table :data="tableData01" v-loading="listLoading" border class="table">
				<el-table-column label="전략 명" prop="signal_name"></el-table-column>
				<el-table-column label="수신자" width="105">
					<template slot-scope="scope">
						<div>slot-scope="scope"</div>
					</template>
				</el-table-column>
				<el-table-column label="전략설치유효기간" width="265">
					<template slot-scope="scope">
						<div>slot-scope="scope"</div>
					</template>
				</el-table-column>
			</el-table>
			<!-- //table -->

			<br>
			<br>

			<div class="table table-origin">
				<table>
					<colgroup>
						<col>
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">제목</th>
							<td>table origin</td>
						</tr>
					</tbody>
				</table>
			</div>

			<br>
			<br>

			<div class="table table-origin btX">
				<table>
					<colgroup>
						<col>
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">제목</th>
							<td>table origin btX</td>
						</tr>
					</tbody>
				</table>
			</div>

			<br>
			<br>

			<div class="table table-origin table-type02">
				<table>
					<colgroup>
						<col>
						<col>
						<col>
					</colgroup>
					<thead>
						<tr>
							<th scope="col" class="bg01">&nbsp;</th>
							<th scope="col" class="bg01">최소사양</th>
							<th scope="col" class="bg01">권장사양</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">운영체제</th>
							<td>Windows XP</td>
							<td>1건</td>
						</tr>
						<tr>
							<th scope="row">하드웨어</th>
							<td>
								Intel Single-Core<br>
								AMD Processor (최소 1.5 GHZ)<br>
								메모리 2GB
							</td>
							<td>
								Intel Dual-Core<br>
								AMD Processor (최소 2.5GHZ)<br>
								메모리 4~8GB
							</td>
						</tr>
						<tr>
							<th scope="row">비디오카드</th>
							<td>16비트 싱글모니터 64MB</td>
							<td>32비트 듀얼모니터 128MB</td>
						</tr>
						<tr>
							<th scope="row">하드디스크</th>
							<td>
								5400RPM<br>
								Free Space 300GB 이상
							</td>
							<td>
								7200RPM OR SSD<br>
								Free Space 500GB 이상
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<br>
			<br>

			<div class="table table-row">
				<table>
					<colgroup>
						<col>
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">제목</th>
							<td>table row</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="guide-heading depth01">
				<h2 class="title">Accordion</h2>
			</div>
			<el-collapse v-model="activeName" accordion class="accordion">
				<el-collapse-item title="Consistency" name="1">
					<div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
					<div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
				</el-collapse-item>
				<el-collapse-item title="Feedback" name="2">
					<div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
					<div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
				</el-collapse-item>
			</el-collapse>

			<hr>

			<el-collapse accordion class="accordion accordion-faq">
				<el-collapse-item name="1">
					<template slot="title">Custom Title 01</template>
					<div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
				</el-collapse-item>
				<el-collapse-item name="2">
					<template slot="title">Custom Title 02</template>
					<div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
				</el-collapse-item>
			</el-collapse>

			<div class="guide-heading depth01">
				<h2 class="title">Ranking List</h2>
			</div>
			<!-- ranking-list -->
			<ul class="ranking-list list-item04" style="border-top: 2px solid #333;">
				<li>
					<span class="name">전일 수익률</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">최근 일주일 수익률</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">최근 한달 수익률</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">최근 3개월 수익률 </span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">승률</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">수익률 표준편차</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">MDD</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">시장 참여비율</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">이익승수</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">진입효율</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">청산효율</span>
					<p class="data">0%</p>
				</li>
				<li>
					<span class="name">일 평균 거래횟수</span>
					<p class="data">0%</p>
				</li>
			</ul>
			<!-- //ranking-list -->

		</div>
	</el-container>
</template>

<script>
	export default {
		data() {
			return {
				show: true,

				name: "Guide",
				modal: false,
				modal2: false,
				modal3: false,

				value1: false,
				value2: false,

				radio: '1',

				options: [{
					value: 'Option1',
					label: 'Option1'
				}, {
					value: 'Option2',
					label: 'Option2'
				}, {
					value: 'Option3',
					label: 'Option3'
				}, {
					value: 'Option4',
					label: 'Option4'
				}, {
					value: 'Option5',
					label: 'Option5'
				}],
				value: '',
				activeName: 'first',

				tableData01: [{
					date: '2016-05-03',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-02',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}]
			};
		},
		created() {},
		mounted() {
			console.log(this.name);
		},
		methods: {
			tabsClick(tab, event) {
				console.log(tab, event);
			}
		}
	}

</script>

<style>
	hr {
		display: block;
		position: static;
		width: 100%;
		margin: 30px 0;
	}

	.guide {
		width: 100%;
		flex: none;
		padding: 0 15px 50px;
	}

	.guide.content {
		background-color: #fff;
	}

	.guide h1.title {
		font-size: 34px;
	}

	.guide h2.title {
		font-size: 26px;
	}

	.guide h3.title {
		font-size: 18px;
		color: #333;
		font-weight: 500;
	}

	.guide .guide-heading.depth01 {
		margin: 60px 0 20px;
		padding-top: 60px;
		border-top: 1px dashed #ccc;
	}

	.guide .guide-heading.depth02 {
		margin: 30px 0 15px;
	}

	.guide .guide-item {
		margin: 10px 0;
	}

</style>

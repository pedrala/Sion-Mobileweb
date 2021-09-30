<template>
	<div>		
		<el-collapse style="padding: 5px 15px;" >
			<el-collapse-item  name="1" style="color: #dff1f1;">
				<template slot="title"  >
					이용방법
				</template>
				<div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
				<div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
			</el-collapse-item>
			<el-collapse-item title="유의사항" name="2" style="color: #dff1f1;" >
				<div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
				<div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>

				<el-collapse accordion class="accordion accordion-faq">
					<el-collapse-item title="자동매매 등록전 꼭 확인해 주세요" name="2-1">
						<div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
					</el-collapse-item>
					<el-collapse-item title="자동매매 유의사항 필참" name="2-2">
						<div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
					</el-collapse-item>
				</el-collapse>
		
			</el-collapse-item>	
		</el-collapse>		
	</div>
</template>

<script>
import {mapGetters	} from "vuex";
export default {
	data() {
		return {			
		
		};
	},
	computed: {
		...mapGetters(['getUserInfo'])
	},
	methods: {
		changeLangType() {
			const self = this;	
			self.$EventBus.$emit("setLogo", {
				type: "",
				text: "이용방법 및 유의사항"//self.$t('cs.b012')
			});
		}				

	},
	created() {
		const self = this;
		self.$EventBus.$emit("setLogo", {
			type: "",
			text: "이용방법 및 유의사항"//self.$t('cs.b012')
		}); // 이용방법 및 유의사항
		self.$EventBus.$emit("setMenuIndex", "3-6");
	},
	mounted() {
		const self = this;
		//self.getData();
		self.$EventBus.$on("changeLangType", self.changeLangType);
	},
	beforeDestroy() {
		const self = this;
		self.$EventBus.$off("changeLangType", self.changeLangType);
	}
}

</script>

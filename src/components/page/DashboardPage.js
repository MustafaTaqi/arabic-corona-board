// src/components/page/DashboardPage.js

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import AirlineSeatIcon from '@material-ui/icons/AirlineSeatFlat';
import ReportIcon from '@material-ui/icons/Report';

import { Sticker } from '@stickyboard/core';
import {
    LineChart,
    MultiLineChart,
    BarChart,
    StackedBarChart,
    ComposedChart,
    PieChart,
    RadarChart,
    AreaChart,
    ScatterChart,
    Treemap,
} from '@stickyboard/recharts';
import { NumberWidget } from '@stickyboard/number';
import { HeatMap } from '@stickyboard/openlayers';

import ApiManager from 'network/ApiManager';
import StatusCode from 'network/StatusCode';

import LocalStorageManager from 'manager/LocalStorageManager';

import PageBaseContainer from 'redux/containers/PageBaseContainer';

import LocalStorageConst from 'constants/LocalStorageConst';

const styles = (theme) => ({
    root: {},
});

const initialLayout = {
    lg: [
        { i: 'TitleWorld', x: 0, y: 0, w: 12, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 3, h: 2 },
        { i: 'BriefRecovered', x: 3, y: 1, w: 3, h: 2 },
        { i: 'BriefDeaths', x: 6, y: 1, w: 3, h: 2 },
        { i: 'BriefFatalityRate', x: 9, y: 1, w: 3, h: 2 },
        { i: 'SelectMenu', x: 0, y: 3, w: 12, h: 2 },
        { i: 'CountryConfirmed', x: 0, y: 5, w: 3, h: 2 },
        { i: 'CountryRecovered', x: 3, y: 5, w: 3, h: 2 },
        { i: 'CountryDeaths', x: 6, y: 5, w: 3, h: 2 },
        { i: 'CountryFatalityRate', x: 9, y: 5, w: 3, h: 2 },
        { i: 'LineChart', x: 6, y: 7, w: 6, h: 6 },
        { i: 'HeatMap', x: 0, y: 7, w: 6, h: 11 },
        { i: 'ComposedChart', x: 6, y: 13, w: 6, h: 5 },
    ],
    md: [
        { i: 'TitleWorld', x: 0, y: 0, w: 12, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 3, h: 2 },
        { i: 'BriefRecovered', x: 3, y: 1, w: 3, h: 2 },
        { i: 'BriefDeaths', x: 6, y: 1, w: 3, h: 2 },
        { i: 'BriefFatalityRate', x: 9, y: 1, w: 3, h: 2 },
        { i: 'SelectMenu', x: 0, y: 3, w: 12, h: 2 },
        { i: 'CountryConfirmed', x: 0, y: 5, w: 3, h: 2 },
        { i: 'CountryRecovered', x: 3, y: 5, w: 3, h: 2 },
        { i: 'CountryDeaths', x: 6, y: 5, w: 3, h: 2 },
        { i: 'CountryFatalityRate', x: 9, y: 5, w: 3, h: 2 },
        { i: 'LineChart', x: 6, y: 7, w: 6, h: 5 },
        { i: 'HeatMap', x: 0, y: 7, w: 6, h: 11 },
        { i: 'ComposedChart', x: 6, y: 12, w: 6, h: 6 },
    ],
    sm: [
        { i: 'TitleWorld', x: 0, y: 0, w: 8, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 4, h: 2 },
        { i: 'BriefRecovered', x: 4, y: 1, w: 4, h: 2 },
        { i: 'BriefDeaths', x: 0, y: 3, w: 4, h: 2 },
        { i: 'BriefFatalityRate', x: 4, y: 3, w: 4, h: 2 },
        { i: 'SelectMenu', x: 0, y: 5, w: 8, h: 2 },
        { i: 'CountryConfirmed', x: 0, y: 7, w: 4, h: 2 },
        { i: 'CountryRecovered', x: 4, y: 7, w: 4, h: 2 },
        { i: 'CountryDeaths', x: 0, y: 9, w: 4, h: 2 },
        { i: 'CountryFatalityRate', x: 4, y: 9, w: 4, h: 2 },
        { i: 'LineChart', x: 0, y: 11, w: 4, h: 6 },
        { i: 'HeatMap', x: 0, y: 17, w: 8, h: 6 },
        { i: 'ComposedChart', x: 4, y: 11, w: 4, h: 6 },
    ],
    xs: [
        { i: 'TitleWorld', x: 0, y: 0, w: 6, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 3, h: 2 },
        { i: 'BriefRecovered', x: 3, y: 1, w: 3, h: 2 },
        { i: 'BriefDeaths', x: 0, y: 3, w: 3, h: 2 },
        { i: 'BriefFatalityRate', x: 3, y: 3, w: 3, h: 2 },
        { i: 'SelectMenu', x: 0, y: 5, w: 6, h: 2 },
        { i: 'CountryConfirmed', x: 0, y: 7, w: 3, h: 2 },
        { i: 'CountryRecovered', x: 3, y: 7, w: 3, h: 2 },
        { i: 'CountryDeaths', x: 0, y: 9, w: 3, h: 2 },
        { i: 'CountryFatalityRate', x: 3, y: 9, w: 3, h: 2 },
        { i: 'LineChart', x: 0, y: 11, w: 6, h: 6 },
        { i: 'HeatMap', x: 0, y: 23, w: 6, h: 6 },
        { i: 'ComposedChart', x: 0, y: 17, w: 6, h: 6 },
    ],
    xxs: [
        { i: 'TitleWorld', x: 0, y: 0, w: 4, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 4, h: 3 },
        { i: 'BriefRecovered', x: 0, y: 4, w: 4, h: 3 },
        { i: 'BriefDeaths', x: 0, y: 7, w: 4, h: 3 },
        { i: 'BriefFatalityRate', x: 0, y: 10, w: 4, h: 3 },
        { i: 'SelectMenu', x: 0, y: 13, w: 4, h: 2 },
        { i: 'CountryConfirmed', x: 0, y: 15, w: 4, h: 3 },
        { i: 'CountryRecovered', x: 0, y: 18, w: 4, h: 3 },
        { i: 'CountryDeaths', x: 0, y: 21, w: 4, h: 3 },
        { i: 'CountryFatalityRate', x: 0, y: 24, w: 4, h: 3 },
        { i: 'LineChart', x: 0, y: 27, w: 4, h: 6 },
        { i: 'HeatMap', x: 0, y: 39, w: 4, h: 6 },
        { i: 'ComposedChart', x: 0, y: 33, w: 4, h: 6 },
    ],
};

const initialBlocks = [
    { i: 'TitleWorld' },
    { i: 'BriefConfirmed' },
    { i: 'BriefRecovered' },
    { i: 'BriefDeaths' },
    { i: 'BriefFatalityRate' },
    { i: 'SelectMenu' },
    { i: 'CountryConfirmed' },
    { i: 'CountryRecovered' },
    { i: 'CountryDeaths' },
    { i: 'CountryFatalityRate' },
    { i: 'LineChart' },
    { i: 'HeatMap' },
    { i: 'ComposedChart' },
];

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);

        const initialCountryName = LocalStorageManager.getItem(
            LocalStorageConst.KEY.SELECTED_COUNTRY,
            'South Korea');

        this.state = {
            // Set initially selected country
            selectedCountryName: initialCountryName,
            // Data
            brief: null,
            countryLatestDict: {},
            countryTimeseriesDict: {},
        };
    }

    componentDidMount() {
        ApiManager.Corona.readBrief(this.readBriefCallback);
        ApiManager.Corona.readLatest(this.readLatestCallback);
        ApiManager.Corona.readTimeseries(this.readTimeseriesCallback);
    }

    onSelectCountry = (event) => {
        this.setState({
            selectedCountryName: event.target.value,
        }, () => {
            LocalStorageManager.setItem(
                LocalStorageConst.KEY.SELECTED_COUNTRY,
                this.state.selectedCountryName);
        });
    };

    readBriefCallback = (statusCode, response) => {
        switch (statusCode) {
            case StatusCode.OK:
                this.setState({
                    brief: response,
                });
                break;
            default:
                alert(response.msg);
                break;
        }
    };

    readLatestCallback = (statusCode, response) => {
        switch (statusCode) {
            case StatusCode.OK:
                let countryLatestDict = {};

                response.forEach((data) => {
                    const {
                        countryregion,
                        provincestate,
                        location,
                        confirmed,
                        deaths,
                        recovered,
                        lastupdate,
                    } = data;

                    // Extract country region list
                    let name = countryregion;
                    if (provincestate !== '') {
                        name += ` (${provincestate})`;
                    }

                    countryLatestDict[name] = {
                        name: name,
                        location: location,
                        confirmed: confirmed,
                        deaths: deaths,
                        recovered: recovered,
                        lastUpdate: lastupdate,
                    };
                });

                this.setState({
                    countryLatestDict: countryLatestDict,
                });
                break;
            default:
                alert(response.msg);
                break;
        }
    };

    readTimeseriesCallback = (statusCode, response) => {
        switch (statusCode) {
            case StatusCode.OK:
                let countryTimeseriesDict = {};

                // Sort country by name
                response.sort((a, b) => {
                    return `${a.countryregion}${a.provincestate}` <
                        `${b.countryregion}${b.provincestate}`
                        ? -1
                        : 1;
                });

                response.forEach((data) => {
                    const {
                        countryregion,
                        provincestate,
                        location,
                        timeseries,
                        lastupdate,
                    } = data;

                    // Extract country region list
                    let name = countryregion;
                    if (provincestate !== '') {
                        name += ` (${provincestate})`;
                    }

                    // Extract timeseries data for each country region
                    const timeseriesData = timeseries;
                    const convertedTimeseries = Object.keys(timeseriesData).map(
                        (key) => {
                            return {
                                ...timeseriesData[key],
                                date: key,
                            };
                        }
                    );

                    countryTimeseriesDict[name] = {
                        name: name,
                        location: location,
                        timeseries: convertedTimeseries,
                        lastUpdate: lastupdate,
                    };

                    
                });

                this.setState({
                    countryTimeseriesDict: countryTimeseriesDict,
                });
                break;
            default:
                alert(response.msg);
                break;
        }
    };

    generateBlock = (block, data) => {
         var arabicCountryNames= {
            "Afghanistan" :  "أفغانستان",
            "Albania" :   "ألبانيا",
            "Algeria" :   "الجزائر",
            "Andorra" :   "أندورا",
            "Angola" :   "أنغولا",
            "Antigua and Barbuda" :   "أنتيغوا وبربودا",
            "Argentina" :   "الأرجنتين",
            "Armenia" :   "أرمينيا",
            "Australia (Australian Capital Territory)" :   "أستراليا (إقليم العاصمة الأسترالية)",
            "Australia (New South Wales)" :   "أستراليا (نيو ساوث ويلز)",
            "Australia (Northern Territory)" :   "أستراليا (الإقليم الشمالي)",
            "Australia (Queensland)" :   "أستراليا (كوينزلاند)",
            "Australia (South Australia)" :   "أستراليا (جنوب أستراليا)",
            "Australia (Tasmania)" :   "أستراليا (تسمانيا)",
            "Australia (Victoria)" :   "أستراليا (فيكتوريا)",
            "Australia (Western Australia)" :   "أستراليا (أستراليا الغربية)",
            "Austria" :   "النمسا",
            "Azerbaijan" :   "أذربيجان",
            "Bahamas" :   "جزر البهاما",
            "Bahrain" :   "البحرين",
            "Bangladesh" :   "بنغلاديش",
            "Barbados" :   "بربادوس",
            "Belarus" :   "بيلاروس",
            "Belgium" :   "بلجيكا",
            "Belize" :   "بليز",
            "Benin" :   "بنين",
            "Bhutan" :   "بوتان",
            "Bolivia" :   "بوليفيا",
            "Bosnia and Herzegovina" :   "البوسنة والهرسك",
            "Botswana" :   "بوتسوانا",
            "Brazil" :   "البرازيل",
            "Brunei" :   "بروناي",
            "Bulgaria" :   "بلغاريا",
            "Burkina Faso" :   "بوركينا فاسو",
            "Burma" :   "بورما",
            "Burundi" :   "بوروندي",
            "Cabo Verde" :   "كابو فيردي",
            "Cambodia" :   "كمبوديا",
            "Cameroon" :   "الكاميرون",
            "Canada" :   "كندا",
            "Canada (Alberta)" :   "كندا (ألبرتا)",
            "Canada (British Columbia)" :   "كندا (كولومبيا البريطانية)",
            "Canada (Diamond Princess)" :   "كندا (الأميرة الماسية)",
            "Canada (Grand Princess)" :   "كندا (جراند برينسيس)",
            "Canada (Manitoba)" :   "كندا (مانيتوبا)",
            "Canada (New Brunswick)" :   "كندا (نيو برونزويك)",
            "Canada (Newfoundland and Labrador)" :   "كندا (نيوفاوندلاند ولابرادور)",
            "Canada (Northwest Territories)" :   "كندا (الأقاليم الشمالية الغربية)",
            "Canada (Nova Scotia)" :   "كندا (نوفا سكوتيا)",
            "Canada (Ontario)" :   "كندا (أونتاريو)",
            "Canada (Prince Edward Island)" :   "كندا (جزيرة الأمير إدوارد)",
            "Canada (Quebec)" :   "كندا (كيبيك)",
            "Canada (Recovered)" :   "كندا (مستردة)",
            "Canada (Saskatchewan)" :   "كندا (ساسكاتشوان)",
            "Canada (Yukon)" :   "كندا (يوكون)",
            "Central African Republic" :   "جمهورية افريقيا الوسطى",
            "Chad" :   "تشاد",
            "Chile" :   "تشيلي",
            "China (Anhui)" :   "الصين (أنهوي)",
            "China (Beijing)" :   "الصين (بكين)",
            "China (Chongqing)" :   "الصين (تشونغتشينغ)",
            "China (Fujian)" :   "الصين (فوجيان)",
            "China (Gansu)" :   "الصين (قانسو)",
            "China (Guangdong)" :   "الصين (قوانغدونغ)",
            "China (Guangxi)" :   "الصين (قوانغشي)",
            "China (Guizhou)" :   "الصين (قويتشو)",
            "China (Hainan)" :   "الصين (هاينان)",
            "China (Hebei)" :   "الصين (خبي)",
            "China (Heilongjiang)" :   "الصين (هيلونغجيانغ)",
            "China (Henan)" :   "الصين (خنان)",
            "China (Hong Kong)" :   "الصين (هونغ كونغ)",
            "China (Hubei)" :   "الصين (هوبي)",
            "China (Hunan)" :   "الصين (هونان)",
            "China (Inner Mongolia)" :   "الصين (منغوليا الداخلية)",
            "China (Jiangsu)" :   "الصين (جيانغسو)",
            "China (Jiangxi)" :   "الصين (جيانغشي)",
            "China (Jilin)" :   "الصين (جيلين)",
            "China (Liaoning)" :   "الصين (لياونينغ)",
            "China (Macau)" :   "الصين (ماكاو)",
            "China (Ningxia)" :   "الصين (نينغشيا)",
            "China (Qinghai)" :   "الصين (تشينغهاي)",
            "China (Shaanxi)" :   "الصين (شنشي)",
            "China (Shandong)" :   "الصين (شاندونغ)",
            "China (Shanghai)" :   "الصين (شنغهاي)",
            "China (Shanxi)" :   "الصين (شانشي)",
            "China (Sichuan)" :   "الصين (سيشوان)",
            "China (Tianjin)" :   "الصين (تيانجين)",
            "China (Tibet)" :   "الصين (التبت)",
            "China (Xinjiang)" :   "الصين (شينجيانغ)",
            "China (Yunnan)" :   "الصين (يونان)",
            "China (Zhejiang)" :   "الصين (تشجيانغ)",
            "Colombia" :   "كولومبيا",
            "Congo (Brazzaville)" :   "الكونغو (برازافيل)",
            "Congo (Kinshasa)" :   "الكونغو (كينشاسا)",
            "Costa Rica" :   "كوستا ريكا",
            "Cote d'Ivoire" :   "كوت ديفوار",
            "Croatia" :   "كرواتيا",
            "Cuba" :   "كوبا",
            "Cyprus" :   "قبرص",
            "Czechia" :   "التشيك",
            "Denmark" :   "الدنمارك",
            "Denmark (Faroe Islands)" :   "الدنمارك (جزر فارو)",
            "Denmark (Greenland)" :   "الدنمارك (جرينلاند)",
            "Djibouti" :   "جيبوتي",
            "Dominica" :   "دومينيكا",
            "Dominican Republic" :   "جمهورية الدومنيكان",
            "Ecuador" :   "إكوادور",
            "Egypt" :   "مصر",
            "El Salvador" :   "السلفادور",
            "Equatorial Guinea" :   "غينيا الإستوائية",
            "Eritrea" :   "إريتريا",
            "Estonia" :   "إستونيا",
            "Eswatini" :   "إيسواتيني",
            "Ethiopia" :   "أثيوبيا",
            "Fiji" :   "فيجي",
            "Finland" :   "فنلندا",
            "France" :   "فرنسا",
            "France (French Guiana)" :   "فرنسا (جويانا الفرنسية)",
            "France (French Polynesia)" :   "فرنسا (بولينيزيا الفرنسية)",
            "France (Guadeloupe)" :   "فرنسا (غواديلوب)",
            "France (Martinique)" :   "فرنسا (المارتينيك)",
            "France (Mayotte)" :   "فرنسا (مايوت)",
            "France (New Caledonia)" :   "فرنسا (كاليدونيا الجديدة)",
            "France (Reunion)" :   "فرنسا (ريونيون)",
            "France (Saint Barthelemy)" :   "فرنسا (سانت بارتيليمي)",
            "France (St Martin)" :   "فرنسا (سانت مارتن)",
            "Gabon" :   "الغابون",
            "Gambia" :   "غامبيا",
            "Georgia" :   "جورجيا",
            "Germany" :   "ألمانيا",
            "Ghana" :   "غانا",
            "Greece" :   "اليونان",
            "Grenada" :   "غرينادا",
            "Guatemala" :   "غواتيمالا",
            "Guinea" :   "غينيا",
            "Guinea-Bissau" :   "غينيا - بيساو",
            "Guyana" :   "غيانا",
            "Haiti" :   "هايتي",
            "Holy See" :   "الكرسي الرسولي",
            "Honduras" :   "هندوراس",
            "Hungary" :   "هنغاريا",
            "Iceland" :   "أيسلندا",
            "India" :   "الهند",
            "Indonesia" :   "إندونيسيا",
            "Iran" :   "إيران",
            "Iraq" :   "العراق",
            "Ireland" :   "أيرلندا",
            "Israel" :   "إسرائيل",
            "Italy" :   "إيطاليا",
            "Jamaica" :   "جامايكا",
            "Japan" :   "اليابان",
            "Jordan" :   "الأردن",
            "Kazakhstan" :   "كازاخستان",
            "Kenya" :   "كينيا",
            "Korea, South" :   "كوريا، جنوب",
            "Kosovo" :   "كوسوفو",
            "Kuwait" :   "الكويت",
            "Kyrgyzstan" :   "قيرغيزستان",
            "Laos" :   "لاوس",
            "Latvia" :   "لاتفيا",
            "Lebanon" :   "لبنان",
            "Liberia" :   "ليبيريا",
            "Libya" :   "ليبيا",
            "Liechtenstein" :   "ليختنشتاين",
            "Lithuania" :   "ليتوانيا",
            "Luxembourg" :   "لوكسمبورغ",
            "MS Zaandam" :   "MS Zaandam",
            "Madagascar" :   "مدغشقر",
            "Malawi" :   "ملاوي",
            "Malaysia" :   "ماليزيا",
            "Maldives" :   "جزر المالديف",
            "Mali" :   "مالي",
            "Malta" :   "مالطا",
            "Mauritania" :   "موريتانيا",
            "Mauritius" :   "موريشيوس",
            "Mexico" :   "المكسيك",
            "Moldova" :   "مولدوفا",
            "Monaco" :   "موناكو",
            "Mongolia" :   "منغوليا",
            "Montenegro" :   "الجبل الأسود",
            "Morocco" :   "المغرب",
            "Mozambique" :   "موزمبيق",
            "Namibia" :   "ناميبيا",
            "Nepal" :   "نيبال",
            "Netherlands" :   "هولندا",
            "Netherlands (Aruba)" :   "هولندا (أروبا)",
            "Netherlands (Bonaire, Sint Eustatius and Saba)" :   "هولندا (بونير وسينت أوستاتيوس وسابا)",
            "Netherlands (Curacao)" :   "هولندا (كوراكاو)",
            "Netherlands (Sint Maarten)" :   "هولندا (سانت مارتن)",
            "New Zealand" :   "نيوزيلاندا",
            "Nicaragua" :   "نيكاراغوا",
            "Niger" :   "النيجر",
            "Nigeria" :   "نيجيريا",
            "North Macedonia" :   "مقدونيا الشمالية",
            "Norway" :   "النرويج",
            "Oman" :   "سلطنة عمان",
            "Pakistan" :   "باكستان",
            "Panama" :   "بنما",
            "Papua New Guinea" :   "بابوا غينيا الجديدة",
            "Paraguay" :   "باراغواي",
            "Peru" :   "بيرو",
            "Philippines" :   "الفلبين",
            "Poland" :   "بولندا",
            "Portugal" :   "البرتغال",
            "Qatar" :   "دولة قطر",
            "Romania" :   "رومانيا",
            "Russia" :   "روسيا",
            "Rwanda" :   "رواندا",
            "Saint Kitts and Nevis" :   "سانت كيتس ونيفيس",
            "Saint Lucia" :   "القديسة لوسيا",
            "Saint Vincent and the Grenadines" :   "سانت فنسنت وجزر غرينادين",
            "San Marino" :   "سان مارينو",
            "Saudi Arabia" :   "المملكة العربية السعودية",
            "Senegal" :   "السنغال",
            "Serbia" :   "صربيا",
            "Seychelles" :   "سيشيل",
            "Sierra Leone" :   "سيرا ليون",
            "Singapore" :   "سنغافورة",
            "Slovakia" :   "سلوفاكيا",
            "Slovenia" :   "سلوفينيا",
            "Somalia" :   "الصومال",
            "South Africa" :   "جنوب أفريقيا",
            "Spain" :   "إسبانيا",
            "Sri Lanka" :   "سيريلانكا",
            "Sudan" :   "السودان",
            "Suriname" :   "سورينام",
            "Sweden" :   "السويد",
            "Switzerland" :   "سويسرا",
            "Syria" :   "سوريا",
            "Taiwan*" :   "تايوان *",
            "Tanzania" :   "تنزانيا",
            "Thailand" :   "تايلاند",
            "Timor-Leste" :   "تيمور - ليشتي",
            "Togo" :   "توجو",
            "Trinidad and Tobago" :   "ترينداد وتوباغو",
            "Tunisia" :   "تونس",
            "Turkey" :   "تركيا",
            "US" :   "الولايات المتحدة",
            "Uganda" :   "أوغندا",
            "Ukraine" :   "أوكرانيا",
            "United Arab Emirates" :   "الإمارات العربية المتحدة",
            "United Kingdom" :   "المملكة المتحدة",
            "United Kingdom (Anguilla)" :   "المملكة المتحدة (أنغيلا)",
            "United Kingdom (Bermuda)" :   "المملكة المتحدة (برمودا)",
            "United Kingdom (British Virgin Islands)" :   "المملكة المتحدة (جزر فيرجن البريطانية)",
            "United Kingdom (Cayman Islands)" :   "المملكة المتحدة (جزر كايمان)",
            "United Kingdom (Channel Islands)" :   "المملكة المتحدة (جزر القنال)",
            "United Kingdom (Falkland Islands (Islas Malvinas))" :   "المملكة المتحدة (جزر فوكلاند (جزر مالفيناس))",
            "United Kingdom (Gibraltar)" :   "المملكة المتحدة (جبل طارق)",
            "United Kingdom (Isle of Man)" :   "المملكة المتحدة (جزيرة مان)",
            "United Kingdom (Montserrat)" :   "المملكة المتحدة (مونتسيرات)",
            "United Kingdom (Turks and Caicos Islands)" :   "المملكة المتحدة (جزر تركس وكايكوس)",
            "Uruguay" :   "أوروغواي",
            "Uzbekistan" :   "أوزبكستان",
            "Venezuela" :   "فنزويلا",
            "Vietnam" :   "فيتنام",
            "West Bank and Gaza" :   "الضفة الغربية وقطاع غزة",
            "Zambia" :   "زامبيا",
            "Zimbabwe" :   "زيمبابوي"
        };

        const {
            selectedCountryName,
            brief,
            countryLatestDict,
            countryTimeseriesDict,
        } = data;
        const { theme } = this.props;

        const colors = theme.colors.colorArray;

        const selectedCountry = countryTimeseriesDict[selectedCountryName];
        const targetTimeseriesData = selectedCountry
            ? selectedCountry.timeseries
            : [];

        const selectedCountryLatest = countryLatestDict[selectedCountryName];

        const pointList = Object.values(countryLatestDict).map(
            (countryLatest) => {
                return {
                    geometry: [
                        countryLatest.location.lng,
                        countryLatest.location.lat,
                    ],
                    weight: Math.min(countryLatest.confirmed / 20, 1.0),
                };
            }
        );

        switch (block.i) {
            case 'TitleWorld':
                return (
                    <Sticker key={block.i}>
                        <div style={{ fontSize: 32, fontWeight: 'bold' }}>
                            العالم
                        </div>
                    </Sticker>
                );
            case 'BriefConfirmed':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon style={{ marginBottom: -4 }} />}
                            backgroundColor={theme.colors.colorArray[0]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'الاصابات المؤكدة'}
                            value={brief ? brief.confirmed : '-'}
                            unit={''}
                        />
                    </Sticker>
                );
            case 'BriefRecovered':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={
                                <LocalHospitalIcon
                                    style={{ marginBottom: -4 }}
                                />
                            }
                            backgroundColor={theme.colors.colorArray[2]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'حالات الشفاء'}
                            value={brief ? brief.recovered : '-'}
                            unit={''}
                        />
                    </Sticker>
                );
            case 'BriefDeaths':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={
                                <AirlineSeatIcon style={{ marginBottom: -4 }} />
                            }
                            backgroundColor={theme.colors.colorArray[1]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'الوفيات'}
                            value={brief ? brief.deaths : '-'}
                            unit={''}
                        />
                    </Sticker>
                );
            case 'BriefFatalityRate':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<ReportIcon style={{ marginBottom: -4 }} />}
                            backgroundColor={theme.colors.colorArray[4]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'معدل الوفيات'}
                            value={
                                brief
                                    ? `${(
                                          (brief.deaths / brief.confirmed) *
                                          100
                                      ).toFixed(2)}`
                                    : '-'
                            }
                            unit={'%'}
                        />
                    </Sticker>
                );
            case 'SelectMenu':
                return (
                    <Sticker key={block.i}>
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                            }}>
                            <div style={{ fontSize: 32, fontWeight: 'bold' }}>
                                 إقليمي
                            </div>

                            <FormControl
                                style={{ minWidth: 200, marginLeft: 32 }}>
                                <InputLabel>الدولة والاقليم</InputLabel>
                                <Select
                                    value={selectedCountryName}
                                    onChange={this.onSelectCountry}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {Object.values(countryTimeseriesDict).map(
                                        (country) => {
                                            return (
                                                <MenuItem
                                                    key={country.name}
                                                    value={country.name}> {country.name} {arabicCountryNames[country.name]}
                                                    
                                                </MenuItem>
                                            );
                                        }
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </Sticker>
                );
            case 'CountryConfirmed':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon style={{ marginBottom: -4 }} />}
                            backgroundColor={theme.colors.colorArray[3]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'الاصابات المؤكدة'}
                            value={
                                selectedCountryLatest
                                    ? selectedCountryLatest.confirmed
                                    : '-'
                            }
                            unit={''}
                        />
                    </Sticker>
                );
            case 'CountryRecovered':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={
                                <LocalHospitalIcon
                                    style={{ marginBottom: -4 }}
                                />
                            }
                            backgroundColor={theme.colors.colorArray[5]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'حالات الشفاء'}
                            value={
                                selectedCountryLatest
                                    ? selectedCountryLatest.recovered
                                    : '-'
                            }
                            unit={''}
                        />
                    </Sticker>
                );
            case 'CountryDeaths':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={
                                <AirlineSeatIcon style={{ marginBottom: -4 }} />
                            }
                            backgroundColor={theme.colors.colorArray[4]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'الوفيات'}
                            value={
                                selectedCountryLatest
                                    ? selectedCountryLatest.deaths
                                    : '-'
                            }
                            unit={''}
                        />
                    </Sticker>
                );
            case 'CountryFatalityRate':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<ReportIcon style={{ marginBottom: -4 }} />}
                            backgroundColor={theme.colors.colorArray[10]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'معدل الوفيات'}
                            value={
                                selectedCountryLatest
                                    ? `${(
                                          (selectedCountryLatest.deaths /
                                              selectedCountryLatest.confirmed) *
                                          100
                                      ).toFixed(2)}`
                                    : '-'
                            }
                            unit={'%'}
                        />
                    </Sticker>
                );
            case 'LineChart':
                return (
                    <Sticker key={block.i}>
                        <MultiLineChart
                            data={targetTimeseriesData}
                            xAxisDataKey={'date'}
                            lineDataArray={[
                                {
                                    key: 'confirmed',
                                    name: 'الحالات المؤكدة',
                                    color: colors[0],
                                },
                                {
                                    key: 'recovered',
                                    name: 'حالات الشفاء',
                                    color: colors[2],
                                },
                                {
                                    key: 'deaths',
                                    name: 'الوفيات',
                                    color: colors[1],
                                },
                            ]}
                        />
                    </Sticker>
                );
            case 'HeatMap':
                return (
                    <Sticker key={block.i}>
                        <HeatMap
                            zoom={3}
                            minZoom={2}
                            maxZoom={17}
                            blur={40}
                            radius={30}
                            longitude={127.024792}
                            latitude={37.504296}
                            pointList={pointList}
                        />
                    </Sticker>
                );
            case 'ComposedChart':
                return (
                    <Sticker key={block.i}>
                        <ComposedChart
                            data={targetTimeseriesData}
                            xAxisDataKey={'date'}
                            barDataKey={'recovered'}
                            barName={'حالات الشفاء'}
                            barColor={colors[2]}
                            lineType={'linear'}
                            lineDataKey={'confirmed'}
                            lineName={'الاصابات المؤكدة'}
                            lineColor={colors[0]}
                        />
                    </Sticker>
                );
        }
    };

    render() {
        return (
            <PageBaseContainer
                data={this.state}
                generateBlock={this.generateBlock}
                initialLayout={initialLayout}
                initialBlocks={initialBlocks}
            />
        );
    }
}

DashboardPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(DashboardPage);

搜索
    url:/search/firstPage
	方法：post
	参数：{
        track:[分类,...],
        keyword:搜索关键字
    }
	返回参数：JSON
	{
        successful: false/true,
        data: {
            pageSum:页码总数,
            content:[{
                title:标题,
                abstract:摘要
            },...]
        }
    }

搜索翻页
	url:/search/turnPage
	方法：get
	参数：{
        page:页码
    }
	返回参数：JSON
	{
        successful: false/true,
        data: {
            content:[{
                title:标题,
                abstract:摘要
            },...]
        }
    }

搜索提示：
    url:/search/suggestion
    方法:get
    参数: {
        keywords:当前已输入的关键字
    }
    返回参数：JSON
    {
        successful: false/true,
        data: {
            suggestions:[...]建议列表
        }
    }

详细信息
    url:/biosearch/getDetail
	方法：post
	参数：{
        id: 队伍id
    }
	返回参数：JSON
	{
        successful: false/true,
        data: {
            name:队伍名字,
            year:年份,
            description:简介,
            background:背景,
            attribution:,
            design:,
            human_practice:,
            result:,
            keywords:,
            track:,
            part_favorite:,
            part_normal:,
            type:队伍组别,
            award:队伍获奖,
            related:[{
                project_name:项目名称,
                link:项目连接
            },...]
        }
    }

biobrick搜索
    url:/biosearch/biobrick
	方法：post
	参数：{
        track:[分类,...],
        name:biobrick名
    }
	返回参数：JSON
	{
        successful: false/true,
        data: {
            pageSum:页码总数,
            content:[{
                title:标题,
                abstract:摘要
            },...]
        }
    }
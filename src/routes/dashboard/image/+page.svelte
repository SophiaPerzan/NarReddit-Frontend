<script lang="ts">
	import IntroCard from '$lib/components/intro-card.svelte';
	import Icon from '@iconify/svelte';
	import html2canvas from 'html2canvas';
	import { tick } from 'svelte';
	let canvas: HTMLDivElement;
	const maxCanvasWidth = 864;
	async function captureElement(element: HTMLElement) {
		if (!element) return alert('Nothing to capture');

		preview = false;
		// Wait for Svelte to apply updates
		await tick();
		html2canvas(element, { backgroundColor: null }).then((canvas) => {
			if (canvas.width > maxCanvasWidth) {
				const scaleFactor = maxCanvasWidth / canvas.width;
				const newCanvas = document.createElement('canvas');
				const newContext = newCanvas.getContext('2d');

				newCanvas.width = maxCanvasWidth;
				newCanvas.height = canvas.height * scaleFactor;

				newContext?.drawImage(canvas, 0, 0, maxCanvasWidth, newCanvas.height);

				const img = newCanvas.toDataURL('image/png');
				downloadImage(img); // This function is provided below
			} else {
				const img = canvas.toDataURL('image/png');
				downloadImage(img); // This function is provided below
			}
		});
		preview = true;
	}

	function downloadImage(dataUrl: string) {
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = 'screenshot.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
	let name: string = 'NarReddit';
	let title: string = 'Post title goes here';
	let views: string = '1.2M';
	let upvotes: string = '24.2k';
	let comments: string = '462';
	let src: string =
		'iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiQAABYkAZsVxhQAACHOSURBVHhe1X0LfFTVtfd/ZpLM5J3J+0EgAUIAeQUBLdxqrba2PrBIW3tB721RqVd7+/1sv9va1n739vZn77V+9d7eVusLrA9Q+7VaxXLrq1r1aosQRECQRx4QIAl5TR4zySQz8/3XPudMzkzOTCYhgfiHlbXP3uvss/Zae6+99zkzZ2yYgpgf3OlAEGVMVpHmkmaTZpCKSDmkdJKblEES9JI6SX2kLlILqZF0mPSRzk98mLQsQD6lMGUcMG9gZyW1WcnkJTYblpHP5HGmKjxz9JDqSDtJr5PeoTPqyc85zqkD5vl2ziJbTS2uIV9GLj07rBUdoSd0PnGQkSLOeJ70Ap1xVDLPBc66A+b27UxBCFfwyhto4EuZlRbWIgafREcIvKTXSJtJ2+kMv2SeLUxOkywwt3unhJMbeMVbSeepzFgGjsEn2RGC/aT7SU/QERK2Jh2T1xQdc7t2OUNQvf1/82ozVaa6KnOjDJqII1QyOn/iIfPF/yVtpiMGVM4kYfKaQFR37LqKV7iLtEhl6FcbNjSdoLjGRpbH5ioZnT/x+ID0AzrhRe1w4jEpqle37SpnzfeQrlMZ0YbSuWZoGQmSGN+IUCw6f+LxDOmf6Ijj2uHEYcJVnnN613rWei+ThWM34JQeEadJt9MJW7TDicGEqTqnZZcsIX/OGm+MNsT4DDhlR8Qm0v+iI2Qpe8aYEBWrTu2qZqO3Mrk0whhRhhi7AafsiKglraMTZJd9Rjhj1apO7pK1/FOsqUCO4xpHT4/PgFNuREhIEie8qh2OD2ekUlXTrr9lDb9mMoVcuqvNqNHSOFF5H2NHaG0FZNP2VTrhKckcD8atyuzju27myQ9FNzKaq0YnIqMSsblKRuRPqRGxkU54WE+PCeNSYXbjrpt55kPqgDWoSqIbFcUnyhGKhY/1jhjB9aTOFWLwCXbEuJww5kvPbmDYASfcaOXJVdIi38wjGp2ITBweKTdyRAhXSYt8M59AR8icMKZwNKZLzq6rvYxn/IGNlZivIYqPz3jWPCEZncdygGIx8keVGztkTriCTpCbewkh4UvNOlpbTfYWzzCtdmI3WrhKxilXzCo/EZkorpLqj+gkiZG6ja0eEx8bZHX0STohoSVqQpeYdbg2nZJvMinrfLaMf/UzbRbxN5qrpEW+mU+UIxQLH0+wTqNDNwZqmbjoQAKbNbvO4yPEHW6IxpfqQ7yAxhWFQjxUaV7XlG8mKddkYpOlTDCSh8hHq0douC5Dp5G6ja0enUaH4aqlTPxcT8eFcUJMzPyodj3Zk4n3Pl3TOHIqGadcsVHKhU/UiBh7PTofHdczFMW9dxS3qpkHauWu5i4mC8zKqKTpOJoPl7PBFuUGV8k45YrFK09ERucqGZFvrZtKWuSb+Rgc0UpaRifEvIsaPwSFcA+pQA0/E402fI2hK+HJqtygEUPcguLKjCE0GfUMy1nrNlo9QpH1kGKjkHSPlrRGTB9W7q+9imzb+HpXNOfEoSqitnHkVDJOuWKjlAufgiPiao4Cy4c6lqdU7q11ku1gqXqSpS4QfRELrpJxyhULH+tdx0JOJS3yzTyukRORMfFIuUlxhDxZW0EnjHi8aR2CQthAWiS6CKkhF7UisaIRQ9OChmWoZQS3kolNljIC4WMITUKRdYk+E6TTMKQjb9CSkRjhq8r3azOZ+z6T8sEoDWZOUodWZVFcJeOUKxY+1jW2kFNJi3wzt+ztRlrAtDo058fgkTrxIOJYuJ4VzrfmUTrVkS/50BH5aYsRI4AevIE00+zZCNJ7VaIjwirfTKoulaaWFj0vUiY2TZSM0LCcWR/JtJKJTVEyYtMbmIqA4SOFitraFLJa5oY/t6MEDKkYPMLTicjE4CrJPwOkdp6QTo2zSEa+Ann0sRUfy/VGlAn0fJWl/tCKRrkFV8k45YrZ1OeOln6YPPzhr8gRIJ9YC9H4w14bu6djjIxE6zlisyMrEMIXvX1Y4ffjqM2BBuap0W+SS6SuccsI9PSwDK0YHhEGj5SLzosmypxHuoJHYRg+UqjYufsFil0dz5MqGadcMat8izyV1I+lTXV2Ox48UY/V770C9+k6DDozsX/+Sty/cDkez8hEcTCATLZE2hOrnlj8jEZEFI+si9pYyKmkRT6x7YBz2WqVIowiVOzYPYtHXC6FRv2spnCVjFNucJWUPxZlBpfkUYcDDzbVYeNvfwgM9QJJWVRlCPC3wVu0Eq+uWoN/q5qPvySnoJKOcFhM2ippOrbiCTkiARnFFBcHSCJhR3jJF9EJ6gPB4RDEobGalDY81ISkwJpkyAlZlZkpLBNr0ubxAPm8oSGs3vmKZvyUPGqWDDhSgdRypHUexurnvofnn3sE9zc1oJ4NPsLQFFEPKRGdEpKhTkomls46aXUZdrK2l8W1aGOER8DwHBDCNSIQqWB8JwhFyluTpYzRKKKNXaKmsxM5LYe1nh8NhwtwlaCw7jX8w9Y7cPDV5/CdjnYcsSfhJJtgnh+Exq1TFIVlBKb8aBquy+i4kXYzyjUZRfJxfAXlgBnv7q5k5jLjBKGRlQ6XWVHUBSzJWsaG/l4vklrpBul64fFvgeRsauxC9XubcdeT/4q33nsTV/h8OExH+FjPpDlitBGhH0fWZW0zvXzZPO/OSqY0BzBzJUlWfWFBg4YrNSqM74xh+dhklgkFqH2Xh42UjDjGN8AVEZxFSBroxN+8/GNsfuY/8ZtD++AOBukIB4IW+o1Vp1gUU0Yg3HAEuSYnuhiky0g5bU2SbwPpISiES/QC6wuQtDKjopGVRlO8ugxSK3z/ICcBUiLGN0PmCFc5Mlv34ku/vQMvvfA4fnayCXV0kNX8IJSQTjpZlRkUU0Zg4pFyI2x2Cf/CPv3N3Q4exAg/I8m60oiKIyheXUJqBCghHscECwNe9jCLL68kpXFEFKL0oxfxrS0/wN43XsQ3u7vU/NBmMT8IjaaTUEIyRk/Xe34siqwrbK9lc3t3OmQElPHA8tZDPCVGlsV3Rry64oMCAy1A3gIgrYSLuF3M4vI0GiluFZ4WvHM/7nnyLry2+12s9A+o+WFARlf0NUlxddJpTDJjc8RMBG1ldmZU0ZOyv9ELRlLkiYmXWVFc+RFgpp/G/+IvgTseI20FviCfASZ8B7VyM2R+4GopxduMT2//Z2z5f/fhiaMfKcNIWLKaH4QSacOYZAxHxHCILic2r3Jkf/WWzzP7SpIqpIqjIp7McNnoNclDmtDgEDx9fVgc5D6gqRZJEmrEkIKADyhYDqz7Ng3LPYGL4aZqIbCEu/mBXG6dn6DOTi5TmW+GzAFczro89Vi07yWs9QRQ4C7E77ib7qBeucpKsXGmNjAQlom+3PDxDrt4QWXoFPaiUHwPRuRFlvHS6li4kR5Jw3XoMtGQUJMqS0/dIQZKpgN//x3g9t1AJZ3Rw7Akzoo2S1KGCk3T9/8W39tyJ2rffhk39faq+cHDa1rND0Lx2mfQmGQEwkfac7Y4YEZUphIc0wUsKLLMcERsZyjlrCAznRVkvzBvCfDNnwEb/ghkzAD6dlI++svwlOPO2sYRVvPmvfjF1n/H9r07MZ87b5kfBuPoFK99BiUko9vTomyGzAFFFgVhUhcwPGfwKIqnRLyyCBovnNwlr7oc+C7D0ZWbORL6gH6LL8FLWHKVwdXdiM9v+wF+9+yDeLjxKE7RQdqy9Sw4QidTXpEj6+9uYYDVP24of0aBkpGTiUHybtZ4mtxD7uFmKsyNtE5dPEle4pBEYnNlgahVpuYALxYHOAeciJoDggNAVgXwCYYZh5wZBzI/zK0BFnI683K+aHiK9TBP7ieZwV4v80NaxyEs3fca1tFfGblFeD4tnXODLjMKErbT6OixTXtldwMTM8Jn6HYxHwukg4gBe2lM5UYep3MVuzLZgYrkJBSnJMGd5EAGyWlnfJUJlv/6uUPt4Vq/g0P+JI19eGgQ/xOQMCF1sJKBfqCtDTcM+vDwe4/A6T/NfN3YQ93AtIuBb3EVlCKfE0gQvCb2MRy9+AAd8SiXr+frBdGgDlziDmXMxgNrvo1/LJ2O2Rzu4gftjojWTgULrpJxyhWLX95om/bybg8TWVYnSsQ5IUrIbQIeX+pMxqoMFxZmpaEyIw1FaU5kpSTDRaMnc6I0qrCCNMpPR3jpiE6/Hye8Pnzk9eLd0+3Y3HQca/w+PLVr08Q4wEA/R9MrvwP++/s8X160EgP+DnSUX4y1a2/FgaQk7RUsJjtMliMOIdRtm/bSbumOYeuJoPT0HulFPLg+3YnP5mWiJi8L5ZlpyKITjDomAl09vdhdV4e29jZc88e7kTLQzOsma4Vn6gABN2O45+vAqb9oqyIr6JPcv9zwU/worxCzVNu1IrNdJsoRsp9vYPf+cUpWiJMwc6R7kpp43eODQZzH3vyr0lzsXzoLD6+oxg3V5ViQn43sCTa+IIVhrDw9DSsK85GUzAk11qpnsiHzjthC88UI0iKv2MqgWDIj8w2SZW8do8kpCj2fVoo7cqpgZ2avGL6Jhr+WBt42pxQvfqIatyyowHz2egkvk4kQlQnopGECXSwh6KXfMI6+Frv3CwK96Midiz+nZaJQwq1uMCsSNZWqcZwxLBNJhziyrrEnozZnNlZnliLJZuuxNw0GOq/gBPrH+WV4bGU1rppVjLzUcQ73qQIJIR/sAO79BrDt7+LEf1plyIMhZyG2zLkIbwyFkMmsWAY0U6RM7BEhXJ74Heb89xNnNh7Km4v5Lm4uNXTZn60u7tuyag4uryxCBh3xscfxOmDTj4FfXMCe/yZXQPLyLQsEuXMO9uNo+Wfxw5Ub8c2cYlT0D0QYfjQnCA07YuRokJBzlCPqGAWezyrFd/JmIzdJPvkTRp99zZzSrhxXRObHE13twO+55Lz7c8Cu/+IamUvPZHm9nFjDhNAge30X2twL8fDy2zB70Wfx7+k5mC6jRsKfYUB9LgjvYvXjWBTpCC3vMOtczZCzj4ZfnV0KR3gpFEan7HjkBXcfX8g+4n9eouFvAP6wgRuvdG7K1NO+SIglafh+ZxH+e+FNWLPsy9iYX44iGqqc4SEkC8EUdkTdeNFkGFhfMMUlH+kI67yLoWZTcTXOSwuHnGi0iAOOaekpCmNXHA2xxoH3gf/iRn4ze31vI3s9w43cVogA5TjJhphfO/OLuG3FBlxRvgA7uNcQwyezWBYCNu6EZamrHo3yfzwynKGOTQ6RkHOEvV5i/ovuMny3SEJO3Pn0mLROXul4xhAdBrnD9Q740ePrh8fbr7jPP4ghNnRckA2Zj/tEFR5MOMU+89hPgf+oAeq3A5kMN+qWg2hhAmO83BtqLLoIP1l+K86vWoXNzjSUDwVQSAuK4WWTaafxHW43T9fCh2HgsJGtiCqZZaSJR9j+ryW58E5xFa50l1iFnGgcslEJednGmF840U0DN3d141h7Fxo7PDjW3YtTfT600+A9VGSQmqXYbcjmMraAc0wZd84VOVmYme/G9Dw3CrIykOxwoL/fh8bjTUjmkrHi6f8De089t4XGnMSW+VuBtb/QbrjJsvKdl7m0vJvpI0CqfHPWopFyGzvQg67sJdhW+Sncnj8d7RxJpYwfVEkElJiNu3h7djbs6ez9qkDLD1ep87AdLbgkj6rzQtiUnY/rCsqQPtp9q2FcJg6YzsQ+0qjv6Gyhwfcdb8a7DSfxenM7/tTLlYS4XpQ3SLQVrYQMGF1F7y653G9cl5eDyyqnYV6BG/YBH1z+fpRvvZMO4CrGbh62PEceSRatpNE5GjrogNTFrN+qkdQl0A2/sxxvTb8U95TMw0sMK7nBAOSRjVxd/troeHtWJuyZbLK+z1Ff/TR0jsGjHTFIfpxOvY7XuKOwDEsy5V2yCUM+pr5AHCAayPtvtPe6RWFgcAj7jp3CH/fXYVNDM+q5VIM8Sk6yI58aaT1KR5SCIxQXMN3PtnokrCgawm0ZKbimvACX/vm+qBFggCfIAxcx+ogyHYPtCNpc2Ff2eTw8fRl+mSYfbQxiGs81DC+KSG+3Z2dpE244X0+Sq6TpOJpLUiJVvXQm8l+783FtQQkyk/TbJ4lDvjUjX2dlhaHQI2Q3StqAGP6vhxvx2M6D2HyyQ/VuV7IDWXKGOsuCC6zSOo9wBCF3TAfY8zvb27E2NIAtvS/DGexmSYyJ1wpy/5+rG//c63FsyeX4YW8IT/d5UcprDV+Pvd7l0sJNKucKlR9p+GiuklH5Ul+dPor/ifPGTUVlmJMx7pf7bmL7b1JV0wHqu8CSFuypP4H739qDh5rauJZ2IJ89XvuSnQ5O9+EjrQaVVDCJKRjHwqUO+R/O48AfGECrpxPrgwPY5NkOZ0hGZgIOCHI972/EUMmV6LjwS+iqmAdbcjIXAQN4lmHyXzu61LWmsafb2OPt6RkMPaxX77kKsmxRXGNWXCX5p143/HqnE7cUFuNCd57cSpDS8eJ62nSLqiEYDFbyYK+nz5f+5Fvv4xu1R1WPL0gWQ1DEUDQM/VhuQTOeSsNBsiUxRMixPMM1dGOYCTHMYGiIc6OffJDH2mNDG68R8vvR2tWJ6zkCHknEAbIQ959EKGMePCvWo33eBRhMZViROmkkO40S4DXf7+zGgz0+vO50ocCZot6JLKFDQZqkcwXFzY7RkhLjm8TwpPUcQV/Nz8fKvDykJT7JWiIYCvX5BgcXZjid9cYl8f7RpjfufX33xY+f7ESOKwnJ0juZrwlISleQsc7uSoWNjZZhbUtmLKXRjQk43CkiuJwvjMYTB/i55fd5uUrsQ6i3mw7owHXcof66eztc8RwwKKHQib5FN6Bt6aXw5RTARmOrz5QSHMm8vg0ZGRkopLE8vOy2Ey34WWsH9gXYCdgxSlh1iqGkqKxzQZAdjesstOm9PYvy38hIx1U0+pKcHKRKO88QbX29ePaj/X/++vkXfkqO9UsTdz56O9JS7i3kMFXNUSVURBolvTotA3bGO1tqGns6e3x49tWNaxyauEpa5Csvyaii8YI0ftexo8j39WGH53UUBzgJ26I3L+zdAS/8My5H24rV6CmtYB6drY8kpQH1dDG+5+XmKgeY0cL9yF9Od+CVTg+2+QZwTCZ/OUvpokQ0sE2ruCr6ZKoLKxm2lnDOKEtLVaNqIvDBqRO4s/av2NbV8S1cf/N/SF645uSfbJ2VbbN9wByu2KRJJOntmZy4MnNoExolrIiuPBHOisGty+V8JoS4BA20taB50I8H2o/i6y1bWcz4bndpciFu7ILZaFiyDumf/AwGHQx1xiNN+UvDJzP8ubmRypZJVsJfDAzS8G1cxTXTIa39fvRyVMjG18VO5+aeQEJVIUd1tuwPwoqfOfo56p/bvw/rPtov7fdWORyLDq9dp76gEXGVvH976gWGiau1dTLX51m52nLNMJoBOTbOJFdJ03EsrpLmfFKIG7FgeytC7H1yU+pXnuP4QvPbcPc3YNCehn0ps/BzZyWedmXi9ysXY+G0Eu6sA8rwYmwxuhhfnDAVUdfehntr38N9ba0oYId22rCt6UvrR35FSZB319Yv2NMynrPnFjK+68s1iYfkStCQNvOoPMUs8s1cJeUPSRwQoAOkw8kk2WJzoDLgxye6WtHW042X5fGkyLL35jlseGhVDZZUlMPJnprLcJMqy8opiAEuOrYfPIAN+/eii7pPY2jTx+yaE19e/3uVJCLGqyMrb7ujsHy/zclGydg03ZgSPxhk5CnSw6lBYZmofDNF1GPnxEbrG8fyRbw2exK25pXi5fxS5LIsnw0oIG8fCmLt23uwt82DsrKyKWv8gy0tuP2VV3Dt7lrVrjK2UW/ffrLtmpQG6VsRKN6651ZK3qcOjFILrpJxyg2ukuZ8c1ohhGDnabUqCk/sZCrF45C3D4HTzSpb1vI9NLrc7n1i2Tx8eflipEzyI9OxoL2vD8/u24eNR7T7m2UM5WJ3DUzZbLed/Mo6+X2CMMJmMFD05PvhVxWE56FR+GhyqjyeDCepQEcrZ0mZfPUCxbQVmFQQ7JXlKY9ZLjf6Oih7R2UpvnnRcpS4Y95vPyvwci/zxpGjuHvffrzJjlSQnKSWumbjcy6t40ZwSdOatdKQMAwzRIBO+Aey+43SRByhknHKhYxD41jBSNMJwR4Pd8b91Jfxi4a2pTi5AstS81GIy9ShU8e5HJX1vI2x04ZmxtmlqU78dNViXDx3NpJkp3sWwc0UdjQ04sF9H+KpTu68afgyGbVSKG2SuMNjB/cRjpzsWxsuuPBXUmSGYYYIFD3+vpMl4dfVGFKJOEIxncukKhsb+fiihuE+oWQV8Q//Z1DRDHK77Jplnc4Vjk3Ci1GZNMzbi6HmE3QCRwrzZanYLM4aHMK3ZxRjw4pFmDetOKzOZMHj89Hwx/DYwUPY0tGp7qiWGstf4+LUy8b9hKOoiPunjA8cBfkrjpaXj3hdTUxd6YSr2MhtymiGlM4Nm0TnC2+lOLfamvcpOD/FjvO4s55GynM6kJZkRxKNKTK+QBCdgwGcHBjCR6T3OMka54ErnhIyiobrlvxQvxeBlhNqN60Vkripax3i3oDlP5pVhjUL56C6tGhC5wd52HSsvRNv1zfiyboGvNrbpwxfYow6Q0/qL7di7Llu1fPVbRqErm44vybxFzYZKHp8z9Nk12lSsR0hn230BVhOmYvTkvGZ/FTUFKajwp2GgnQnMpyMiTS81RMicYT6yKI/gHYvd6ndPuxt78MbnV4879W+E+agM4oNT8hI8Pcj0HpKhSWlBElKh3j9drVJAzYW5+KqqhlYPL0ExTlZvP7Y79/0DfhxssuDvSeb8VpjE+5v69BGpxje0CfcJGk/1UtPh6OggDxNMlgaeqZh+dKvqEILhE+3QtFje8rJdlJK3n1Gab1Ocmlys/RWGm+By4GvlWXi4hk5mJ2fgezUM98U9fmH0NDlxbsnu/BMczde9dEZ7G2ldIa6M8u5QCbuoIchQFqhO1f+BqhfmzwoEmekJOFredlYXpSHqoJcFGdnIjvNBRd7pswZ0o4Aw4Wf84kYvKPXiyYa/WBbJ/7KHv9CD50stzxodLkrnMwL6FbQ/siB9HruoqXH23O4IJCFgxrJ8hLX0PmNK5bGfGmfpnUcFP56j/wkibpVrTobuWH4K7NScNOcXKyqyEVBZtyHz2cET/8gak91YWtDGx7xcJJm7yujIwTBXo/ayEHutOqjQbOKJG0YYFo2Qqrnit7Sc2nMeaQc2fHz0EsHnGR7WiSMiZxUIQU0uOw/9Etp+WYuhqcjHe4cGt6tHnHqhtdgw/WNF9SM/7WVBuiERyh4I6c+dDBOr0pLwncX5OPiqjxkuc7eLYABGmnXiU48cLgFT3T3w8mwVkAjBQf93Eu0cRXFlYhMykZPMaDSWp48H+M0T8doJMdy59fFshSSRHTlQ11eJBRUmhADE9rzZDF8zvDtGt34StSGTY2fqLlJkvFgVBsXpY/uSe8F3uwOhpbeNycHX15SjPyMyevxo8HLifv1htP44aFW7Ga6JJmTHvNlgg56OhDs41LbcITAaGUUV6Es2sACk9ywBHs75cNP1mR5LBOsEtAMrwmplLz06qJjK2sYv+JDOy0R/GxH9Y41s99aXulW36aZCmju6cejH57A9092q1XTNI4G6dGhAZ+2p+CyNcTRMWxkNldabLRa54afIqGfw1AkPVw9S1a341NVCNOKxSlKylynenn3sb+pmbiXdxsIhUKXkf2BFOPJ+NmHdL6/NLXj7g+buWoaQA6Nky7xW8q4XxBnyG0OxWWekIlZhRHDKRoTLrts7Slfkrr9LhtAWxrJ6dL2JGHwXNN5imncz+Mrjn2yZuJfX2+ATtB+wGGKoZsT9bYjLfhWXTtaOZHKgyXtiareRIakkOyidVKPRXVHKMNzQla3Pbhc1R6t8mT5VJ5a+QkkuhCGxaz5uuMX10zeDzgYoBNuJtN+wmSK4RiXrs8casZ3JCzRaEU0ZJK00iD5E05Hcv0mwnCeRU/X5DSuMMw3Hv9UzeT/hImB8TghEAwxAgTU5ksmNFmHO4wt/ATj4Oke/IarpX9ulR/bDiGXc0Qqrym3R6wNGGl8i9g+gqukdrzx+KfHbnyBUd24QCesI3uUZDknePp8ON7ahSOn2lHX6sEJjxft3FDJcjKZBnFzCVualYaZBVmYVZKHGYVu5GXJ5xcmBmLSQ3TEtvrTuKe5B62yOeN1ZRerTxMRBh3mwz3fyhESvBjIbFy6+unQrzZdOrawY4ZR7bihT8wyJ6jVkZ+bmQONzfjT3kY8z1Dw506vCIU3NtpCWyQJsZCxQWLekkwXrq0swGULKrCoshTpE/i9hRPdPrzT1IHnTnrwVK9+T4w6uamPjIzYPV6UBGQPJO+iF33LuP+Ym+w4vXMo8LeezyQ+4VrBuMwZgU6oHhwKbH3v4PGlj719AA/Vt2sFKQ642ePCF4nRSGESGjrEEXJDjj31C8VZuPmCObhowUxkTOBXpnzcN9R39qG2tRvvtPXitb4BHDLfBBRldL00rnWOTHaetekpuDQ/E1XZ6bXcBK6rKXKf+58yNPCNh19O/+WBlp8jxX6jm8sPVbG5dqt0NCeMntguI8MfwLUl2fj2JQtx4bwKdlhzJWcO+ZREp9ePFjrhVG8/Wn2D6B4cQj/nKpm4M+RTgQyTJelOlGamIj/NCafDrn7Mk3PYqJusRDCxLSJy73x6PXuNfOZl+Fc3FLShrGDkm7nR+3QYh+qmGsPajxdPx42XLEFJ3jl7+iUbrNtp+Kn5c7ZmuH/wlNxFvYfKXqfFfllbc9tOMh4xKoewB8pmSR6whIbIjTedmJwhSXFdh38I8xkCfnrJAlxWMwfO5DP7eOAYoX7Qme2Z+j/obEbuj567yu4uusuW4lqkbtHSmsr2EVelecXwatfaz11rDzl3rrJhUrLaHCLntcmnNAaGsHFmPm779GI1UU8y1E+a0/Afr580N6P4hR5noKV+Aye5qB/114yqJYT4R7iaiP0Iej0I9XZp93L0ckOsjROp4O4l0/GVVQswncvXCUb4R/1p/BGPEScS0qazgoIH98inLeT9+beSzgtfmTzCEYpLJjlHRVCc0N2ujQh98S5/eQQPw1K6Mwn/uWIWrlpWjeJci7fujg3yenn52MgTNHzEpxcmC0aTzxoKHtiTwr2AvMJdftLjUmqgvfBNbG5oY+aSOdiPYNdpBPs8w3mEbCk4TjDIsFTFlcr3ls3E5TVVKM0f00Qtnxv4E0lWN9tpeLl9etZgNPWcoOChPbPIVlMLeZeyfKVdfjLRekTQ0CE6IOg5rZ4Jy11Lo1wcoT5SzhFRmJqM7y+ajs8tmYVZpQXqdocFZAm5k/Q86QUaXX1Q9lzAaOI5B51RSW3kdb6XkIsz5INhw9//EU0lBMnnhxiSgr2dXEVxLhDn6K0Q1i0jgvsHkb2tIg9XL6rEiuryHndGWj2L3yO9TnqHRpfjcw5d9amF/Af3OGx2lFG7Kh5W08bC5a1eRTS4vH8gPTTQlxP0tGWGfL3SCrnj1kkuPbuLjWrhzNnY6/UfwYnug7dcMvvwr772uRM0ur7OnSoA/j8KWuNvQIVbdAAAAABJRU5ErkJggg==';
	let heart: boolean = false;
	let verified: boolean = true;
	let preview = true;
	let base64Modal: HTMLDialogElement;
</script>

<div
	class="flex gap-4 flex-col items-center md:flex-row md:w-full md:justify-between md:items-start"
>
	<div class="flex flex-col w-fit gap-y-4 lg:w-full">
		<!-- <textarea
			class="textarea textarea-bordered w-full max-w-md h-80"
			placeholder="Enter html here"
			bind:value={html}
		/>-->
		<div>
			<label class="label" for="name input">
				<span class="label-text">Name</span>
			</label>
			<input
				type="text"
				bind:value={name}
				name="name input"
				class="input input-bordered w-full max-w-sm"
			/>
		</div>
		<div>
			<label class="label" for="title input">
				<span class="label-text">Title</span>
			</label>
			<input
				type="text"
				bind:value={title}
				name="title input"
				class="input input-bordered w-full max-w-sm"
			/>
		</div>
		<div>
			<label class="label" for="views input">
				<span class="label-text">Views</span>
			</label>
			<input type="text" bind:value={views} name="views input" class="input input-bordered w-fit" />
		</div>
		<div>
			<label class="label" for="upvotes input">
				<span class="label-text">Upvotes</span>
			</label>
			<input
				type="text"
				bind:value={upvotes}
				name="upvotes input"
				class="input input-bordered w-fit"
			/>
		</div>
		<div>
			<label class="label" for="comments input">
				<span class="label-text">Comments</span>
			</label>
			<input
				type="text"
				bind:value={comments}
				name="comments input"
				class="input input-bordered w-fit"
			/>
		</div>
		<div>
			<label class="label justify-start gap-x-2 w-fit hover:cursor-pointer">
				<span class="label-text">Base64 Image string</span>
				<!-- Open the modal using ID.showModal() method -->
				<button on:click={() => base64Modal.showModal()}
					><Icon icon="material-symbols:info" class="inline text-xl text-base-content" /></button
				>
				<dialog bind:this={base64Modal} class="modal modal-bottom sm:modal-middle">
					<form method="dialog" class="modal-box">
						<h3 class="font-bold text-lg">What is a base64 image string?</h3>
						<p class="pt-1 pb-4">
							A Base64 image string is a way of representing images as a string of characters. Due
							to browser security rules, pasting an image link would not work. The base64 string is
							a workaround for this.
						</p>
						<h3 class="font-bold text-lg">How do I convert my image to base64?</h3>
						<p class="py-1">
							Visit an <a
								class="text-blue-500 hover:underline"
								href="https://base64.guru/converter/encode/image"
								target="_blank"
								rel="noopener noreferrer">online image to base64 converter</a
							> to convert your image. Paste your result in the textbox and it should work!
						</p>
					</form>
					<form method="dialog" class="modal-backdrop">
						<button>close</button>
					</form>
				</dialog>
			</label>
			<input type="text" bind:value={src} class="input input-bordered w-full max-w-sm" />
		</div>
		<div class="gap-x-4 flex">
			<div class="text-center">
				<span class="label label-text">Upvote or heart?</span>
				<label class="swap swap-flip">
					<!-- this hidden checkbox controls the state -->
					<input type="checkbox" bind:checked={heart} />

					<div class="swap-on">
						<Icon icon="material-symbols:favorite" class="inline text-5xl text-red-600" />
					</div>
					<div class="swap-off">
						<Icon icon="bx:bxs-upvote" class="inline text-5xl text-red-600" />
					</div>
				</label>
			</div>
			<div>
				<label class="label" for="verified">
					<span class="label-text">Verified?</span>
				</label>
				<input bind:checked={verified} type="checkbox" name="verified" class="toggle mt-4" />
			</div>
		</div>

		<button
			on:click={() => captureElement(canvas)}
			class="btn btn-outline btn-accent w-40 mt-6 mb-2">Save image</button
		>
	</div>
	<div class="flex flex-col w-full items-center lg:items-start">
		<div class="w-fit" bind:this={canvas} class:x2={!preview}>
			<IntroCard {title} {name} {views} {upvotes} {comments} {src} {preview} {heart} {verified} />
		</div>
	</div>
</div>

<style>
	.x2 {
		transform: scale(2, 2);
	}
</style>
